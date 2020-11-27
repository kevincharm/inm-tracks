import create, { StateCreator } from 'zustand'
import * as uuid from 'uuid'

export interface LoadingStore {
    currentlyLoading: string[]
    isLoading: boolean
    beginLoading: () => () => void
    trackPromise: <T>(promise: Promise<T>) => Promise<T>
}

const useLoadingStore = createLoadingStore()

export default useLoadingStore

export function createLoadingStore(initValues: StateCreator<Partial<LoadingStore>> = () => ({})) {
    const store = create<LoadingStore>((set, get, api) => ({
        currentlyLoading: [],
        isLoading: false,
        beginLoading: () => {
            const uid = uuid.v4()
            set({
                currentlyLoading: get().currentlyLoading.concat(uid),
            })

            return () => {
                set({
                    currentlyLoading: get().currentlyLoading.filter((e) => e !== uid),
                })
            }
        },
        trackPromise: async <T>(promise: Promise<T>) => {
            const done = get().beginLoading()
            try {
                return await promise
            } catch (err) {
                throw err
            } finally {
                done()
            }
        },
        ...initValues(set, get, api),
    }))

    store.subscribe<LoadingStore['currentlyLoading']>(
        (currentlyLoading) => {
            store.setState({
                isLoading: currentlyLoading!.length > 0,
            })
        },
        (store) => store.currentlyLoading
    )

    return store
}
