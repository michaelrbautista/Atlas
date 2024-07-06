import Navbar from "@/components/Navbar";
import SignUpForm from "./signUpForm";

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <div className='py-20 mx-auto text-center flex flex-col items-center max-w-3xl gap-4'>
        <h1 className="text-6xl font-bold text-primaryText">
          Play at the next level.
        </h1>
        <h1 className="text-3xl font-bold text-secondaryText">
          Get access to training and nutrition protocols to help you play Division 1 soccer.
        </h1>
        <div className="mt-6 w-96">
          <SignUpForm></SignUpForm>
        </div>
      </div>
    </div>
  );
}
