import NebConnectButton from "@/components/wallet/NebConnectButton";
import { disconnect } from "@wagmi/core";
import NebulaiApi from "@/neb-api/NebulaiApi";
import Link from "next/link";
import { RootState, useAppSelector } from "@/redux/store";

const SidebarFooter = () => {
  const { user, useWalletLinked } = useAppSelector((state:RootState) => state.auth);
  const {logoutUser} = NebulaiApi();

  const logoutHandler = async () => {
    await logoutUser();
    await disconnect();
  };
  return (
    <div className="mm-add-listing mm-listitem pro-footer d-flex flex-column">
      {user && user.role ? (
        <>
          <Link
            href={`/${user.role}/dashboard`}
            className="theme-btn btn-style-one"
          >
            Go to Dashboard
          </Link>
        </>
      ) : (
        <>
          <Link href={"/login"} className={"theme-btn btn-style-one"}>
            Login
          </Link>

          <Link href={"/register"} className={"theme-btn btn-style-one mt-4"}>
            Register
          </Link>
        </>
      )}

      <div className="my-4">
        {useWalletLinked && <NebConnectButton btnLbl={"Connect Wallet"} />}
      </div>

      {user && (
           <div className="mt-3">
            <Link href="#" onClick={logoutHandler}>
              <i className={`la la-sign-out`}></i> SignOut
            </Link>
           </div>
         )}
    </div>
  );
};

export default SidebarFooter;
