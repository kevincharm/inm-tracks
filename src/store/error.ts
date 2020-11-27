import create, { StateCreator } from 'zustand'
import UserError from '../lib/UserError'

export interface ErrorStore {
    errors: UserError[]
    raiseError: (error: UserError) => void
    dismissError: (error: UserError) => void
}

const useErrorStore = createErrorStore()

export default useErrorStore

export function createErrorStore(initValues: StateCreator<Partial<ErrorStore>> = () => ({})) {
    return create<ErrorStore>((set, get, api) => ({
        errors: [],
        raiseError: (error: UserError) => {
            console.error('Error raised:', error.message)

            set((store) => ({
                errors: store.errors.concat(error),
            }))
        },
        dismissError: (error: UserError) => {
            set((store) => ({
                errors: store.errors.filter((e) => e.uid !== error.uid),
            }))
        },
        ...initValues(set, get, api),
    }))
}
