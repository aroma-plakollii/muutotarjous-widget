import Autocomplete, {usePlacesWidget} from "react-google-autocomplete";
import React, {useContext, useEffect, useState} from "react";
import GlobalContext from "../store/GlobalContext";
import {GMAPKEY} from "../config";

interface IGoogleAddressAutocomplete {
    addressLabel: string,
    // onAddressSelect: (address: string) => void,
    onNext?: any,
    onCheckAddress: (address: string) => void
}

const GoogleAddressAutocomplete = (props: IGoogleAddressAutocomplete) => {
    const {globalState, setGlobalState} = useContext(GlobalContext);
    const [state, setState] = useState({
        address: '',
        hasError: false
    });

    useEffect(() => {
        props.onNext = checkAddress
    }, [props.onNext]);

    const checkAddress = () => {

        console.log('hello')

        // if (state.address === ''){
        //     setState({...state, hasError: true})
        //     props.onCheckAddress(state.address)
        //
        //     console.log('1a')
        // }else {
        //     setState({...state, hasError: false})
        //     props.onCheckAddress(state.address)
        //     console.log('2a')
        // }
    }

    const onAddressChange = async (place: any) => {
        let city = '';
        place.address_components.forEach((addressComponent: any) => {
            if (addressComponent.types[0] === 'locality') {
                city = addressComponent.long_name;
            }
        })

        setState({...state, address: place.formatted_address})

        updateGlobalContextAddress(
            props.addressLabel,
            {
                name: place.formatted_address,
                city,
                placeId: place.place_id,
            }
        );
    };

    const updateGlobalContextAddress = (key: string, value: any) => {
        setGlobalState({
            ...globalState,
            movingServiceForm: {
                ...globalState.movingServiceForm,
                address: {
                    ...globalState.movingServiceForm.address,
                    [key]: value
                }
            }
        })
    };

    return (
        <>
            <Autocomplete
                apiKey={GMAPKEY}
                onPlaceSelected={(place: any) => onAddressChange(place)}
                options={{
                    types: ["address"],
                    componentRestrictions: { country: "fi" },
                }}
                language={'fi'}
                placeholder={"Esimerkikatu 1, Helsinki"}
                className={`form-control ${state.hasError && !state.address ? 'is-invalid' : ''}`}
                defaultValue={state.address}
            />
        </>
    )
}

export default GoogleAddressAutocomplete