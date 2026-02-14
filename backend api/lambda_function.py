

import json
import os
import boto3
import hashlib
import uuid
from datetime import datetime
from botocore.exceptions import ClientError
from decimal import Decimal

# ===============================
# DynamoDB Tables
# ===============================
dynamodb = boto3.resource("dynamodb")

users_table = dynamodb.Table(os.environ["USERS_TABLE"])
sample_users_table = dynamodb.Table(os.environ["SAMPLE_USERS_TABLE"])
fleet_table = dynamodb.Table(os.environ["FLEET_TABLE"])  # use env variable

# ===============================
# Helpers
# ===============================

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError


def response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        "body": json.dumps(body, default=decimal_default)
    }


def parse_body(event):
    try:
        return json.loads(event.get("body") or "{}")
    except:
        return {}


def hash_password(password, salt=None):
    salt = salt or uuid.uuid4().hex
    hashed = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}${hashed}"


def verify_password(password, stored):
    salt, _ = stored.split("$")
    return hash_password(password, salt) == stored


def extract_id(path, base):
    return path.split(f"/{base}/")[-1]


# ===============================
# Lambda Handler
# ===============================

def lambda_handler(event, context):

    method = event.get("httpMethod")
    path = event.get("path", "")
    body = parse_body(event)

    # ===============================
    # CORS
    # ===============================
    if method == "OPTIONS":
        return response(200, {})

    # =====================================================
    # AUTH
    # =====================================================

    if method == "POST" and path.endswith("/auth/signup"):

        if not body.get("email") or not body.get("password"):
            return response(400, {"message": "Email and password required"})

        try:
            users_table.put_item(
                Item={
                    "email": body["email"],
                    "name": body.get("name", ""),
                    "username": body.get("username", ""),
                    "phone": body.get("phone", ""),
                    "role": body.get("role", "user"),
                    "passwordHash": hash_password(body["password"]),
                    "createdAt": datetime.utcnow().isoformat()
                },
                ConditionExpression="attribute_not_exists(email)"
            )
            return response(201, {"message": "Signup successful"})
        except ClientError:
            return response(409, {"message": "User already exists"})

    if method == "POST" and path.endswith("/auth/login"):

        if not body.get("email") or not body.get("password"):
            return response(400, {"message": "Email and password required"})

        res = users_table.get_item(Key={"email": body["email"]})
        user = res.get("Item")

        if not user or not verify_password(body["password"], user["passwordHash"]):
            return response(401, {"message": "Invalid credentials"})

        return response(200, {
            "email": user["email"],
            "name": user.get("name", ""),
            "role": user.get("role", "")
        })
        # =====================================================
    # USERS (Registered Users Page)
    # =====================================================

    # GET ALL USERS
    if method == "GET" and path.endswith("/users"):
        res = users_table.scan()
        return response(200, res.get("Items", []))

    # CREATE USER
    if method == "POST" and path.endswith("/users"):

        if not body.get("email"):
            return response(400, {"message": "Email required"})

        item = {
            "email": body["email"],
            "name": body.get("name", ""),
            "username": body.get("username", ""),
            "phone": body.get("phone", ""),
            "role": body.get("role", "user"),
            "passwordHash": hash_password(body.get("password", "123456")),
            "createdAt": datetime.utcnow().isoformat()
        }

        users_table.put_item(Item=item)
        return response(201, item)

    # UPDATE USER
    if method == "PUT" and "/users/" in path:

        email = extract_id(path, "users")

        users_table.update_item(
            Key={"email": email},
            UpdateExpression="""
                SET #n=:n,
                    phone=:p,
                    username=:u,
                    #r=:r
            """,
            ExpressionAttributeNames={
                "#n": "name",
                "#r": "role"
            },
            ExpressionAttributeValues={
                ":n": body.get("name", ""),
                ":p": body.get("phone", ""),
                ":u": body.get("username", ""),
                ":r": body.get("role", "user")
            }
        )

        return response(200, {"message": "User updated"})

    # DELETE USER
    if method == "DELETE" and "/users/" in path:

        email = extract_id(path, "users")

        users_table.delete_item(Key={"email": email})

        return response(200, {"message": "User deleted"})

    # =====================================================
    # SAMPLE USERS (Renter Page)
    # =====================================================

    if method == "GET" and path.endswith("/sample-users"):
        res = sample_users_table.scan()
        return response(200, res.get("Items", []))

    if method == "POST" and path.endswith("/sample-users"):

        if not body.get("email"):
            return response(400, {"message": "Email required"})

        # Auto increment ID
        res = sample_users_table.scan(ProjectionExpression="id")
        items = res.get("Items", [])

        ids = []
        for item in items:
            if "id" in item:
                try:
                    ids.append(int(item["id"]))
                except:
                    pass

        new_id = max(ids) + 1 if ids else 1

        item = {
            "id": new_id,
            "email": body["email"],
            "name": body.get("name", ""),
            "phone": body.get("phone", ""),
            "city": body.get("city", ""),
            "address": body.get("address", ""),
            "postal": body.get("postal", ""),
            "country": body.get("country", ""),
            "status": body.get("status", "active"),
            "createdAt": datetime.utcnow().isoformat()
        }

        sample_users_table.put_item(Item=item)
        return response(201, item)

    # UPDATE SAMPLE USER
    if method == "PUT" and "/sample-users/" in path:

        email = extract_id(path, "sample-users")

        sample_users_table.update_item(
            Key={"email": email},
            UpdateExpression="""
                SET #n=:n,
                    phone=:p,
                    city=:c,
                    address=:a,
                    postal=:po,
                    country=:co,
                    #s=:s
            """,
            ExpressionAttributeNames={
                "#n": "name",
                "#s": "status"
            },
            ExpressionAttributeValues={
                ":n": body.get("name", ""),
                ":p": body.get("phone", ""),
                ":c": body.get("city", ""),
                ":a": body.get("address", ""),
                ":po": body.get("postal", ""),
                ":co": body.get("country", ""),
                ":s": body.get("status", "active")
            }
        )

        return response(200, {"message": "Sample user updated"})

    # DELETE SAMPLE USER
    if method == "DELETE" and "/sample-users/" in path:

        email = extract_id(path, "sample-users")
        sample_users_table.delete_item(Key={"email": email})
        return response(200, {"message": "Sample user deleted"})

    # RENTALS (Fleet Table)
    # =====================================================

    # GET ALL RENTALS (exclude soft deleted)
    if method == "GET" and path.endswith("/rentals"):

        res = fleet_table.scan()

        items = res.get("Items", [])

        # Filter out soft deleted
        active_items = [
            item for item in items
            if not item.get("isDeleted", False)
        ]

        return response(200, active_items)

    # CREATE RENTAL
    if method == "POST" and path.endswith("/rentals"):

        if not body.get("renterId"):
            return response(400, {"message": "renterId required"})

        rental_id = str(uuid.uuid4())

        item = {
            "rentalId": rental_id,
            "renterId": body["renterId"],
            "paymentMethods": body.get("paymentMethods", []),
            "rentalType": body.get("rentalType", "daily"),
            "dailyFee": body.get("dailyFee", ""),
            "deposit": body.get("deposit", ""),
            "driverType": body.get("driverType", ""),
            "startDate": body.get("startDate", ""),
            "endDate": body.get("endDate", ""),
            "isDeleted": False,
            "createdAt": datetime.utcnow().isoformat()
        }

        fleet_table.put_item(Item=item)
        return response(201, item)

    # UPDATE RENTAL
    if method == "PUT" and "/rentals/" in path:

        rental_id = extract_id(path, "rentals")

        fleet_table.update_item(
            Key={"rentalId": rental_id},
            UpdateExpression="""
                SET renterId=:r,
                    paymentMethods=:pm,
                    rentalType=:rt,
                    dailyFee=:df,
                    deposit=:dp,
                    driverType=:dt,
                    startDate=:sd,
                    endDate=:ed,
                    updatedAt=:u
            """,
            ExpressionAttributeValues={
                ":r": body.get("renterId", ""),
                ":pm": body.get("paymentMethods", []),
                ":rt": body.get("rentalType", "daily"),
                ":df": body.get("dailyFee", ""),
                ":dp": body.get("deposit", ""),
                ":dt": body.get("driverType", ""),
                ":sd": body.get("startDate", ""),
                ":ed": body.get("endDate", ""),
                ":u": datetime.utcnow().isoformat()
            }
        )

        return response(200, {"message": "Rental updated"})

    # SOFT DELETE RENTAL
    if method == "DELETE" and "/rentals/" in path:

        rental_id = extract_id(path, "rentals")

        fleet_table.update_item(this 
            Key={"rentalId": rental_id},
            UpdateExpression="""
                SET isDeleted=:d,
                    deletedAt=:t
            """,
            ExpressionAttributeValues={
                ":d": True,
                ":t": datetime.utcnow().isoformat()
            }
        )

        return response(200, {"message": "Rental soft deleted"})
