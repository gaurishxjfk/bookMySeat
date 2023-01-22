import { create } from 'zustand'

const useStore = create((set) => ({

loginModal: false,
userEmail: "",
reservedEmails: [],
selectedDate: "",
recordsData: [],

toggleLoginModal: () => set((state) =>  ({ loginModal: !state.loginModal})),
updateUserEmail: (email) => set((state) =>  ({userEmail: email})),
updateReservedEmails: (email) => set((state) =>  ({reservedEmails: [...state.reservedEmails, email]})),
removeReservedEmails: (email) => set((state) =>  ({reservedEmails: state.reservedEmails.filter((i) => i !== email)})),
setSelectedDate: (date) => set((state) =>  ({ selectedDate: date})),
setRecordsData: (data) => set((state) =>  ({ recordsData: data})),


}))

export default useStore