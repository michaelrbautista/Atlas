import MobileSidebar from "./MobileSidebar";

const Navbar = () => {
    return (
        <div className="fixed w-full flex z-50 sm:hidden h-16 text-white bg-background">
            <MobileSidebar></MobileSidebar>
        </div>
    );
}
 
export default Navbar;