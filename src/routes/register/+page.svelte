<script>
  import { auth } from "$lib/firebase";
  import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { loading } from "$lib/store";

  let email = "";
  let password = "";
  let username = "";

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      //if user is logged in, redirect to dashboard
      if (user) {
        goto("/dashboard");
      }
    });

    return unsubscribe;
  });

  const register = async () => {
    loading.set(true);
    //firebase auth code
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          // Signed in
          const user = userCredential.user;
          updateProfile(auth.currentUser, {
            displayName: username,
          });
          //alert
          alert(`Welcome ${username}!`);
          goto("/dashboard");
        }
      );
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
    loading.set(false);
  };
</script>

<div>
  {#if $loading}
    <div class="alert flex flex-col items-center justify-center min-h-screen">
      <div
        class=" alert-info loading-circle w-10 h-10 rounded-full border-accent border-2"
      />
      <p class="text-accent text-xl font-bold">Loading...</p>
    </div>
  {:else}
    <div class="flex flex-col items-center justify-center min-h-screen">
      <div class="p-4 rounded shadow-md">
        <h1 class="text-2xl font-bold mb-4">Register</h1>
        <form class="flex flex-col gap-4" on:submit|preventDefault={register}>
          <input
            class="input"
            type="text"
            bind:value={username}
            placeholder="Username"
            required
          />
          <input
            class="input"
            type="email"
            bind:value={email}
            placeholder="Email"
            required
          />
          <input
            class="input"
            type="password"
            bind:value={password}
            placeholder="Password"
            required
          />
          <button class="btn btn-primary" type="submit">Register</button>
        </form>
      </div>
    </div>
  {/if}
</div>

<style>
  .loading-circle {
    animation: loading-grow 1s infinite alternate;
  }

  
  @keyframes loading-grow {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.5);
    }
  }

</style>
