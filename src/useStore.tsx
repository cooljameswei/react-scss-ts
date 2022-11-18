import { createSlice } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import { useHistory } from "react-router-dom";

export const NF = (n: string | number) =>
    String(n).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
export const toDate = (timestamp: number) => {
    const d = new Date(timestamp * 1e3);
    return [d.getMonth() + 1, d.getDate()].join("/");
};
export const toKillo = (n: number) => {
    return Number(n) < 1000 ? String(n) : `${~~(Number(n) / 1000)}k`;
};
export const ellipsis = (address: string, start?: number) => {
    if (!address) return "";
    const len = start || 10;
    return address.length > len
        ? `${address.slice(0, start || 10)}...${address.slice(-4)}`
        : address;
};
export const now = () => Math.round(+new Date().getTime() / 1e3);
export const isSolcVersionText = (version: string) =>
    /^v\d{1,2}\.\d{1,2}\.\d{1,2}\+commit\.[0-9a-f]{8}$/.test(version);

export const validateAddress = (address: string) =>
    /^0x[a-f0-9A-F]{40}$/.test(address);
export const isHex = (hex: string) => /^0x[a-f0-9A-F]+$/.test(hex);
export const validateEmail = (email: string): boolean =>
    email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) !== null;
export const validateUsername = (username: string): boolean =>
    /^[a-zA-Z0-9]{6,20}$/.test(username);

export const prettyFormat = (n: number, p: number = 8) => {
    const x = String(n.toFixed(p))
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
        .split(".");
    return (
        <>
            <span>{x[0]}.</span>
            <span className="gray">{x[1]}</span>
        </>
    );
};

declare interface StoreObject {
    lang: string;
    theme: string;
    cookie?: string;
    loading: boolean;
    name: string;
}
const appKey = "myProject-v.1.10";

export const copyToClipboard = (text: string) => {
    var textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
};

const getStore = (initialState: StoreObject) => {
    const _init = initialState as any;
    try {
        const buf = window.localStorage.getItem(appKey);
        if (buf) {
            const json = JSON.parse(buf);
            for (let k in json) {
                if (_init[k] !== undefined) {
                    _init[k] = json[k];
                }
            }
        }
        _init.loading = false;
    } catch (err) {
        console.log(err);
    }
    return _init;
};

const setStore = (state: any) => {
    delete state.L;
    window.localStorage.setItem(appKey, JSON.stringify(state));
};

const initialState: StoreObject = {
    theme: "",
    lang: "en-US",
    cookie: "",
    loading: false,
    name: "Yong Jun",
};

export const slice = createSlice({
    name: "store",
    initialState: getStore(initialState),
    reducers: {
        update: (state: any, action: any) => {
            for (const k in action.payload) {
                if (state[k] === undefined) new Error(`undefined store key ${k}`);
                state[k] = action.payload[k];
            }
            setStore(state);
        },
    },
});

const useStore = () => {
    const G = useSelector((state: StoreObject) => state);
    const dispatch = useDispatch();
    const update = (payload: Partial<StoreObject>) =>
        dispatch(slice.actions.update(payload));

    const showLoading = (show: boolean) => update({ loading: show });

    return { ...G, update, showLoading };
};

export default useStore;
