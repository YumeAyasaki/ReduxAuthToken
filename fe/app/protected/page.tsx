export default async function ProtectedPage() {
  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center text-white">
        You are logged in as 
        <SignOut />
      </div>
    </div>
  );
}

function SignOut() {
  return (
    <form>
      <button type="submit">Sign out</button>
    </form>
  );
}
