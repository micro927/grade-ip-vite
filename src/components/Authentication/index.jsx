import {

    // useNavigate,
    // useLocation,
    // Navigate,
    useSearchParams,

} from "react-router-dom";
import AlertLayout from '../../layouts/AlertLayout'

function Authentication() {

    const [searchParams] = useSearchParams();
    var cmucode = searchParams.get("code")

    // ยิงไป myapi ที่เอาไป getAccessTokenAuthCode($code) ต่อ

    return (
        <AlertLayout>
            Logging in....... {cmucode}
        </AlertLayout>
    )
}

export default Authentication