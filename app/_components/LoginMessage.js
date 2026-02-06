import Link from "next/link";

function LoginMessage() {
  return (
    <div className="flex h-full items-center justify-center px-10">
      <p className="text-center text-xl leading-relaxed">
        Please{" "}
        <Link href="/login" className="underline text-accent-500">
          login
        </Link>{" "}
        to reserve this
        <br />
        cabin right now
      </p>
    </div>
  );
}

export default LoginMessage;
