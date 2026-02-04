import { GetServerSideProps } from "next";

type Props = {
  email: string;
};

export default function UserPage({ email }: Props) {
  return (
    <div className="min-h-screen bg-blue-600 text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        Welcome to login {email}
      </h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  // Simple decode (you already trust the cookie here)
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  return {
    props: {
      email: payload.email ?? "",
    },
  };
};

