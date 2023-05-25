<script>
  import { auth } from "$lib/firebase";
  import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  //importing tweened and cubicOut from svelte/motion
  import { loading } from "$lib/store";

  /**
   * after users register their acount(see src\routes\register\+page.svelte)
   * next time, they'll be most likely to login
   * so we'll use the same code from register page
   * but instead of creating a new user, we'll sign in with the existing user
   * and redirect them to dashboard
   * user only needs to enter email and password
   */
  let email = "";
  let password = "";

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      //if user is logged in, redirect to dashboard
      if (user) {
        await goto("/dashboard");
      }
    });

    return unsubscribe;
  });

  const login = async () => {
    loading.set(true);
    //firebase auth code
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Signed in
      const user = userCredential.user;
      // Wait for navigation to complete before setting loading to false
      await goto("/dashboard");
      loading.set(false);
    } catch (error) {
      loading.set(false); // Make sure to set loading to false in case of error as well
      console.log(error);
    }
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
        <h1 class="text-2xl font-bold mb-4">Login</h1>
        <form class="flex flex-col gap-4" on:submit|preventDefault={login}>
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
          <button class="btn btn-primary" type="submit">Login</button>
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
