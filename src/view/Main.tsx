import React, {useContext} from "react";
import GlobalContext from "../store/GlobalContext";
import Packages from "./Packages";
import Deliver from "./Deliver";
import Pickup from "./Pickup";
import Summary from "./Summary";
import PaymentDetails from "./PaymentDetails";
import ThankYou from "./ThankYou";
// import '../../node_modules/bootstrap/dist/js/bootstrap.min';

const Main = () => {
    const {globalState} = useContext(GlobalContext)

    return(
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className={'pt-5 pb-5 p-1'}>
                        {
                            globalState.step === 1 && <Packages/>
                        }

                        {
                            globalState.step === 2 && <Deliver/>
                        }

                        {
                            globalState.step === 3 && <Pickup/>
                        }

                        {
                            globalState.step === 4 && <Summary/>
                        }

                        {
                            globalState.step === 5 && <PaymentDetails/>
                        }

                        {
                            globalState.step === 6 && <ThankYou/>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main;