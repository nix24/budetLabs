<script>
  // import necessary functions and variables
  // check if user is logged in
  // if not, keep the page the same
  // if yes, prompt user to go to the dashboard
  import { auth } from "$lib/firebase";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { loading } from "$lib/store";
  let user;
  onMount(async () => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      user = u;
    });
    return () => {
      unsubscribe();
    };
  });

  const handleLogout = async () => {
    loading.set(true);
    try {
      await auth.signOut();
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
    loading.set(false);
  };
</script>

{#if $loading}
  <!--loading screen using tailwind, refacotring to apply loading spin-->
  <div
    class="alert flex flex-col items-center justify-center min-h-screen"
  >
    <div class=" alert-info loading-circle w-10 h-10 rounded-full border-accent border-2"></div>
    <p
    class="text-accent text-xl font-bold"
    >Loading...</p>
  </div>

{:else if user}
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div transition:fade={{ duration: 300 }}>
      <div class="p-4 rounded shadow-md">
        <h1 class="text-2xl font-bold mb-4">Welcome to our Financial App</h1>
        <p class="mb-4">Manage your finances with ease and efficiency.</p>
        <div class="flex gap-4">
          <a class="btn btn-primary" href="/dashboard"> Go to Dashboard </a>
          <button class="btn btn-secondary" on:click={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div
    class="flex flex-col items-center justify-center min-h-screen"
    transition:fade={{ duration: 500 }}
  >
    <div class="p-4 rounded shadow-md">
      <h1 class="text-2xl font-bold mb-4">Welcome to our Financial App</h1>
      <p class="mb-4">Manage your finances with ease and efficiency.</p>
      <div class="flex gap-4">
        <a class="btn btn-primary" href="/login">Login</a>
        <a class="btn btn-secondary" href="/register">Sign Up</a>
      </div>
    </div>
  </div>
{/if}

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