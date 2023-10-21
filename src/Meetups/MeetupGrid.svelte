<script>
    import { createEventDispatcher } from "svelte";
    import MeetupItem from "./MeetupItem.svelte";
    import MeetupFilter from "./MeetupFilter.svelte";
    import Button from "../UI/Button.svelte";
    import { scale } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    
    const dispatch = createEventDispatcher();

    export let meetups;

    let favsOnly = false;

    // if favsOnly is true we want to filter meetups by if he is favourite, if favsOnly is false we want to set them to meetups
    $: filteredMeetups = favsOnly ? meetups.filter(m => m.isFavorite) : meetups;

    function setFilter(event) {
        // if it is 1 the favsOnly is true because we are sending 1 at on click Favourite button (and 0 with All button)
        favsOnly = event.detail === 1;
    };


</script>

<style>
    #meetups {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1rem;
    }

    #meetup-controls {
        margin: 1rem;
        display: flex;
        justify-content: space-between;
    }

    #no-meetups {
        margin : 1rem;
    }

    @media (min-width: 768px) {
        #meetups {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>

<section id="meetup-controls">
<MeetupFilter on:select={setFilter} />

<Button on:click={() => dispatch('add')}>
    New Meetup
</Button>
</section>

{#if filteredMeetups.length === 0}
    <p id="no-meetups"> No Meetups found, you can start adding some.</p>
{/if}

<section id="meetups">
    {#each filteredMeetups as meetup (meetup.id)}
    <div transition:scale animate:flip={{ duration: 300 }}>
        <MeetupItem 
                    id={meetup.id}
                    title={meetup.title}
                    subtitle={meetup.subtitle}
                    imageURL={meetup.imageURL}
                    description={meetup.description}
                    address={meetup.address}
                    contactEmail={meetup.contactEmail}
                    isFavorite={meetup.isFavorite}
                    on:showdetails
                    on:edit
        />
    </div>
    {/each}
    </section>