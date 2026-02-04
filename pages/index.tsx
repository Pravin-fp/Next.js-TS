import { GetServerSideProps } from "next";

export default function Home() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.token;

  return {
    redirect: {
      destination: token ? "/dashboard" : "/login",
      permanent: false,
    },
  };
};
