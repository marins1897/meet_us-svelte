<script>
    import { onMount } from "svelte";
    import Header from "./UI/Header.svelte";
    import MeetupGrid from "./Meetups/MeetupGrid.svelte";
    import EditMeetup from "./Meetups/EditMeetup.svelte";
    //import Button from "./UI/Button.svelte";
    import meetupItems from './Meetups/meetups-store';
    import MeetupDetail from "./Meetups/MeetupDetail.svelte";
    import LoadingSpinner from "./UI/LoadingSpinner.svelte";
    import Error from "./UI/Error.svelte";

    let editMode = null;
    let page = 'overview';
    let pageData = {};
    let editedId = null;

    let isLoading = true;
    let error = null;

    onMount( async () => {
        isLoading = true;
        try {
            const response = await fetch('https://svelte-21a94-default-rtdb.firebaseio.com/meetups.json');

            if (!response.ok) {
                console.log(response)
                throw new Error('Failed to load meetups, please try again later');
            };

            const data = await response.json();

            const loadedMeetups = [];

            for (const key in data) {
                loadedMeetups.push({
                    ...data[key],
                    id : key,
                })
            };

            setTimeout(() => {
                meetupItems.setMeetups(loadedMeetups.reverse());
                isLoading = false;
            }, 1000);
        
        } catch (err) {
            error = err;
            console.error(err);
            isLoading = false;
        }
    })

    function saveMeetupHandler(event) {
        editMode = null;
        editedId = null;
    };

    function cancelEdit() {
        editMode = null;
        editedId = null;
    };

    function showDetails(event) {
        page = 'details';
        pageData.id = event.detail;
    };

    function closeDetails() {
        page = 'overview';
        pageData = {};
    };

    function startEditMeetupHandler(event) {
        editMode = 'edit';
        editedId = event.detail;
    };

    function clearError() {
        error = null;
    }

</script>

<style>
    main {
        margin-top: 5rem;
    }
</style>

{#if error}
<Error message={error.message} on:close={clearError}/>
{/if}

<Header />
<main>
{#if page === 'overview'}

    {#if editMode === 'edit'}
        <EditMeetup on:save={saveMeetupHandler}
                    on:close={cancelEdit}
                    id={editedId} />
    {/if}

    {#if isLoading}
        <LoadingSpinner />
    {:else}
        <MeetupGrid meetups={$meetupItems} 
                    on:showdetails={showDetails} 
                    on:edit={startEditMeetupHandler} 
                    on:add={() => editMode = 'edit'}
        />
    {/if}
{:else}
    <MeetupDetail id={pageData.id} on:close={closeDetails}/>
{/if}
</main>