import { createContext, useCallback, useContext, useRef, useState } from "react";
import Alert, { AlertBoxProps} from "@/components/Alert";

type refFunc = (choice: boolean | string) => Promise<boolean | string> | void;

type ConfirmFunc = (data: AlertBoxProps) => Promise<boolean | void> | unknown; 

const ConfirmDialog = createContext<ConfirmFunc | any>(null);

export function ConfirmDialogProvider({
  children,
}: {
  children: React.ReactNode
}){
    const [state, setState] = useState({isOpen: false});
    const fn = useRef<refFunc>(()=>{});

    const confirm = useCallback((data: AlertBoxProps) => { 
        return new Promise((resolve) => {
          setState({ ...data, isOpen: true })
          fn.current = (choice: boolean | string) => { 
            setState({ isOpen: false })
            resolve(choice)
          }
        })
    }, [ setState ]) 

    return (
        <ConfirmDialog.Provider value={confirm}>
            {children}
            <Alert 
                {...state}
                onClose={() => fn.current(false)}   
                onConfirm={() => fn.current(true)} 
                onCustomBtn={() => fn.current('customClick')} 
            />
        </ConfirmDialog.Provider>
    )
}

export default function useConfirm(){
    return useContext(ConfirmDialog);
}