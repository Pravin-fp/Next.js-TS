
import json
import os
import boto3
import hashlib
import uuid
from datetime import datetime
from botocore.exceptions import ClientError

# ===============================
# DynamoDB
# ===============================
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["USERS_TABLE"])

# ===============================
# Helpers
# ===============================
def response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        "body": json.dumps(body)
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

def extract_email(path):
    if "/users/" in path:
        return path.split("/users/")[-1]
    return None

# ===============================
# Lambda Handler
# ===============================
def lambda_handler(event, context):

    print("EVENT 👉", json.dumps(event))

    method = event.get("httpMethod")
    path = event.get("path", "")
    body = parse_body(event)

    # ===============================
    # CORS
    # ===============================
    if method == "OPTIONS":
        return response(200, {})

    # ===============================
    # SIGNUP
    # POST /auth/signup
    # ===============================
    if method == "POST" and path.endswith("/auth/signup"):
        if not body.get("email") or not body.get("password"):
            return response(400, {"message": "Email and password required"})

        try:
            table.put_item(
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

    # ===============================
    # LOGIN
    # POST /auth/login
    # ===============================
    if method == "POST" and path.endswith("/auth/login"):
        if not body.get("email") or not body.get("password"):
            return response(400, {"message": "Email and password required"})

        res = table.get_item(Key={"email": body["email"]})
        user = res.get("Item")

        if not user or not verify_password(body["password"], user["passwordHash"]):
            return response(401, {"message": "Invalid credentials"})

        return response(200, {
            "email": user["email"],
            "name": user.get("name", ""),
            "role": user.get("role", "")
        })

    # ===============================
    # GET USERS
    # GET /users
    # ===============================
    if method == "GET" and path.endswith("/users"):
        res = table.scan()
        return response(200, [
            {
                "email": u["email"],
                "name": u.get("name", ""),
                "username": u.get("username", ""),
                "phone": u.get("phone", ""),
                "role": u.get("role", "")
            }
            for u in res.get("Items", [])
        ])

    # ===============================
    # CREATE USER (ADMIN)
    # POST /users
    # ===============================
    if method == "POST" and path.endswith("/users"):
        if not body.get("email"):
            return response(400, {"message": "Email required"})

        table.put_item(
            Item={
                "email": body["email"],
                "name": body.get("name", ""),
                "username": body.get("username", ""),
                "phone": body.get("phone", ""),
                "role": body.get("role", "user"),
                "passwordHash": hash_password(body.get("password", "123456")),
                "createdAt": datetime.utcnow().isoformat()
            }
        )
        return response(201, {"message": "User created"})

    # ===============================
    # UPDATE USER
    # PUT /users/{email}
    # ===============================
    if method == "PUT" and "/users/" in path:
        email = extract_email(path)
        if not email:
            return response(400, {"message": "Email missing in path"})

        table.update_item(
            Key={"email": email},
            UpdateExpression="""
                SET #n = :n,
                    username = :u,
                    phone = :p,
                    #r = :r
            """,
            ExpressionAttributeNames={
                "#n": "name",
                "#r": "role"
            },
            ExpressionAttributeValues={
                ":n": body.get("name", ""),
                ":u": body.get("username", ""),
                ":p": body.get("phone", ""),
                ":r": body.get("role", "user")
            }
        )
        return response(200, {"message": "User updated successfully"})

    # ===============================
    # DELETE USER
    # DELETE /users/{email}
    # ===============================
    if method == "DELETE" and "/users/" in path:
        email = extract_email(path)
        if not email:
            return response(400, {"message": "Email missing in path"})

        table.delete_item(Key={"email": email})
        return response(200, {"message": "User deleted successfully"})

    # ===============================
    # NOT FOUND
    # ===============================
    return response(404, {"message": "Route not found"})
