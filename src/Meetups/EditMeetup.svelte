<script>
    import { createEventDispatcher } from "svelte";
    import meetupItems from './meetups-store';
    import TextInput from "../UI/TextInput.svelte";
    import Button from "../UI/Button.svelte";
    import Modal from "../UI/Modal.svelte";
    import { isNotEmpty, isValidEmail } from '../helpers/validation';

    let title='';
    let subtitle='';
    let imageURL='';
    let address='';
    let contactEmail='';
    let description='';
    // if editing we will have id (gotten through props)
    export let id; 

    if (id) {
        const unsubscribe = meetupItems.subscribe(items => {
            const selectedMeetup = items.find(i => i.id === id);
            title = selectedMeetup.title;
            subtitle = selectedMeetup.subtitle;
            address = selectedMeetup.address;
            contactEmail = selectedMeetup.contactEmail;
            imageURL = selectedMeetup.imageURL;
            description = selectedMeetup.description;
        });

        unsubscribe();
    }

     
    $: titleIsValid = isNotEmpty(title);
    $: subtitleIsValid = isNotEmpty(subtitle);
    $: imageURLIsValid = isNotEmpty(imageURL);
    $: addressIsValid = isNotEmpty(address);
    $: descriptionIsValid = isNotEmpty(description);
    $: emailIsValid = isValidEmail(contactEmail);

    $: formIsValid = titleIsValid && subtitleIsValid && addressIsValid && imageURLIsValid && emailIsValid && descriptionIsValid;


    const dispatch = createEventDispatcher();

    async function submitForm() {
        const meetupData = {
            title: title,
            subtitle: subtitle,
            imageURL: imageURL,
            address: address,
            contactEmail: contactEmail,
            description: description,
        };

        if (id) {
            try {
                const response = await fetch(`https://svelte-21a94-default-rtdb.firebaseio.com/meetups/${id}.json`, {
                    // here we are not sending isFavorite status
                    // with PATCH we will have our isFavorite status provided by Firebase ( we will update just updated/changed fields in Firebase, the rest will stay same)
                    // with PUT we do not have isFavorite status (we will override old meetup and would not have isFavorite status field then because we are not sending it)
                    method :'PATCH',
                    body : JSON.stringify(meetupData),
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('An error occured, please try again!');
                }

                const data = await response.json();
                console.log(data);
                // update it locally
                meetupItems.updateMeetup(id, meetupData);

            } catch (error) {
                console.error(error);
            };
        
        } else {
            try {
                const response = await fetch('https://svelte-21a94-default-rtdb.firebaseio.com/meetups.json', {
                    method :'POST',
                    body : JSON.stringify({...meetupData, isFavorite : false}),
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('An error occured, please try again!');
                }

                const data = await response.json();
                console.log(data);
                // extract the ID from firebase and add it to store when adding meetup (data.name)
                meetupItems.addMeetupHandler({...meetupData, isFavorite : false, id : data.name});

            } catch (error) {
                console.error(error);
            };
        }
        // dispatch 'save' event to App component to close the modal after save is triggered
        dispatch('save');
    };

    async function deleteHandler() {
        try {
            const response = await fetch(`https://svelte-21a94-default-rtdb.firebaseio.com/meetups/${id}.json`, {
                method :'DELETE',
                });
                
                if (!response.ok) {
                    throw new Error('An error occured, please try again!');
                }
                
                meetupItems.deleteMeetup(id);
                dispatch('save');

            } catch (error) {
                console.error(error);
            };
    };

    function close() {
        dispatch('close');
    };

</script>

<style>
    form {
        width: 100%;
    }
</style>
<Modal title="Add Meetup" on:close needCloseButton={false}>
<form on:submit|preventDefault={submitForm}>

    <TextInput id="Title" 
            label="Title" 
            value={title} 
            valid={titleIsValid}
            validityMessage="Please enter a valid title."
            on:input={event => title = event.target.value} 
    />

    <TextInput id="Subtitle" 
            label="Subtitle" 
            value={subtitle} 
            valid={subtitleIsValid}
            validityMessage="Please enter a valid subtitle."
            on:input={event => subtitle = event.target.value}
    />

    <TextInput id="imageurl" 
            label="Image Url" 
            value={imageURL} 
            valid={imageURLIsValid}
            validityMessage="Please enter a valid image URL."
            on:input={event => imageURL = event.target.value} 
    />

    <TextInput id="Address" 
            label="Address" 
            value={address} 
            valid={addressIsValid}
            validityMessage="Please enter a valid address."
            on:input={event => address = event.target.value} 
    />

    <TextInput id="Email" 
            label="Email" 
            value={contactEmail} 
            valid={emailIsValid}
            validityMessage="Please enter a valid email. With @."
            on:input={event => contactEmail = event.target.value} 
            type="email"
    />

    <TextInput id="Description" 
            label="Description" 
            value={description} 
            valid={descriptionIsValid}
            validityMessage="Please enter a valid description."
            on:input={event => description = event.target.value} 
            rows="3"
            controlType="textarea"
    />

</form>

<div slot="footer">
    <Button type="button" mode="outline" on:click={close}>Cancel</Button>
    <Button type="button" on:click={submitForm} disabled={!formIsValid}>Save</Button>

    {#if id} 
    <Button type="button" on:click={deleteHandler}>Delete</Button> 
    {/if}
</div>
</Modal>