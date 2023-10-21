import { writable } from "svelte/store";

const meetups = writable([]);

const customMeetupsStore = {
    subscribe : meetups.subscribe,
    setMeetups : (meetupArray) => {
        meetups.set(meetupArray);
    },
    addMeetupHandler : (meetupData) => {
        const newMeetup = {
            ...meetupData,
        };
        meetups.update(items => {
            return [newMeetup, ...items];
        })
    },
    updateMeetup : (id, meetupData) => {
        meetups.update(items => {
            // find index of updated item
            const meetupIndex = items.findIndex(i => i.id === id);
            // find object of founded item to update
            // overwrite it with new meetupData passed
            // ...mergeData (three dots for merging it with copied item at that index)
            const updatedMeetup = { ...items[meetupIndex], ...meetupData };
            // copy all items
            const updatedMeetups = [ ...items ];
            // access the item at our founded index and replace it with updatedMeetup
            updatedMeetups[meetupIndex] = updatedMeetup;
            return updatedMeetups;
        });
    },
    deleteMeetup : (id) => {
        meetups.update(items => {
            return items.filter(i => i.id !== id);
        });
    },
    toggleFavorite : (id) => {
        meetups.update(items => {
            // spread operator because we want to work with copies and not mutate original value
        // when we mutate this object we do not mutate directly object in the array
        const updatedMeetup = {...items.find(i => i.id === id)};
        // set favorite opposite as it was before
        updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
        // copy entire array and replace the element with founded index
        const meetupIndex = items.findIndex(i => i.id === id);
        // copy existing meetups
        const updatedMeetups = [...items];
        // select item at index and overwrite it with updated meetup
        updatedMeetups[meetupIndex] = updatedMeetup;
        // overwrite existing meetups array with updated array
        return updatedMeetups;
        });
    }
};

export default customMeetupsStore;