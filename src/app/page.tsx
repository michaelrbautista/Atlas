import Navbar from "@/components/Navbar";
import SignUpForm from "./signUpForm";

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <div className='py-20 mx-auto text-center flex flex-col items-center max-w-3xl gap-4'>
        <h1 className="text-6xl font-bold text-primaryText">
          You can go D1.
        </h1>
        <h1 className="text-3xl font-bold text-secondaryText">
          Get access to training, nutrition, and lifestyle protocols to play Division 1 soccer.
        </h1>
        <div className="mt-6 w-96">
          <SignUpForm></SignUpForm>
        </div>
      </div>
    </div>
  );
}
