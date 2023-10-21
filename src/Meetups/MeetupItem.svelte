<script>
    import meetupItems from './meetups-store';
    import { createEventDispatcher } from 'svelte/internal';
    import Badge from "../UI/Badge.svelte";
    import Button from "../UI/Button.svelte";
    import LoadingSpinner from '../UI/LoadingSpinner.svelte';

    export let id;
    export let title;
    export let subtitle;
    export let imageURL;
    export let description;
    export let address;
    //export let contactEmail;
    export let isFavorite;

    let isLoading = false;

    async function toggleFavorite() {
      isLoading = true;
      try {
        const response = await fetch(`https://svelte-21a94-default-rtdb.firebaseio.com/meetups/${id}.json`, {
                  method :'PATCH',
                  body : JSON.stringify({ isFavorite : !isFavorite}),
                  headers : {
                        'Content-Type' : 'application/json'
                        }
                  });
                
          if (!response.ok) {
            throw new Error('An error occured, please try again!');
          }

          meetupItems.toggleFavorite(id);
          isLoading = false;

      } catch (error) {
        console.error(error);
        isLoading(false);
      };
    };

    const dispatch = createEventDispatcher();

</script>

<style>
  article {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    background: white;
    margin: 1rem;
  }

  header,
  .content,
  footer {
    padding: 1rem;
  }

  .image {
    width: 100%;
    height: 14rem;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  h1 {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    font-family: "Roboto Slab", sans-serif;
  }

  /*h1.is-favorite {
    background: #01a129;
    color: white;
    padding: 0 0.5rem;
    border-radius: 5px;
  }*/

  h2 {
    font-size: 1rem;
    color: #808080;
    margin: 0.5rem 0;
  }

  p {
    font-size: 1.25rem;
    margin: 0;
  }

  div {
    text-align: right;
  }

  .content {
    height: 4rem;
  }
</style>

<article>

  <header>
    <h1>{ title } 
      {#if isFavorite}
        <Badge>FAVORITE</Badge>
      {/if}
    </h1>
    <h2>{ subtitle }</h2>
    <p> {address}</p>
  </header>

  <div class="image">
    <img src="{ imageURL }" alt="{ title }" />
  </div>

  <div class="content">
    <p>{description}</p>
  </div>

  <footer>

    <Button type="button" mode="outline" on:click={() => dispatch('edit', id)}>
      Edit
    </Button>

    <Button type="button" on:click={() => dispatch('showdetails', id)}>
      Show Details 
    </Button>

    {#if isLoading} 
      <LoadingSpinner />
    {:else}
      <Button type="button" 
              color="{isFavorite ? null : 'success'}" 
              mode="outline" 
              on:click="{toggleFavorite}">
              {isFavorite ? 'Unfavorite' : 'Favorite'}
      </Button>
    {/if}

  </footer>

</article>
