<script>
  import { goto } from "$app/navigation";

  // import necessary functions and variables
  import { db, auth } from "$lib/firebase";
  //import firestore collection and doc functions
  import { collection, addDoc } from "firebase/firestore";
  import { loading } from "$lib/store";
  let sourceName = "";
  let amount = "";
  let payDate = "";
  let frequency = "";

  const addIncome = async () => {
    // add code to store the income in Firebase
    // use the same format as the bills
    loading.set(true);
    try {
      const incomeCollectionRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "incomes"
      );
      await addDoc(incomeCollectionRef, {
        sourceName,
        amount,
        payDate,
        frequency,
      });
      //redirect to dashboard
      alert(`Income: ${sourceName} added!`);
      loading.set(false);
      goto("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };
</script>

<div class="p-4">
  <h1 class="text-2xl font-bold mb-4">Add New Income</h1>

  <form on:submit|preventDefault={addIncome}>
    <div class="form-control">
      <label for="sourceName" class="label">
        <span class="label-text">Source Name</span>
      </label>
      <input
        id="sourceName"
        class="input input-bordered"
        type="text"
        bind:value={sourceName}
        required
      />
    </div>

    <!-- Amount -->
    <div class="form-control">
      <label for="amount" class="label">
        <span class="label-text">Amount</span>
      </label>
      <input
        id="amount"
        class="input input-bordered"
        type="number"
        bind:value={amount}
        required
      />
    </div>

    <!-- Pay Date -->
    <div class="form-control">
      <label for="payDate" class="label">
        <span class="label-text">Pay Date</span>
      </label>
      <input
        id="payDate"
        class="input input-bordered"
        type="date"
        bind:value={payDate}
        required
      />
    </div>

    <!-- Frequency -->
    <div class="form-control">
      <label for="frequency" class="label">
        <span class="label-text">Frequency</span>
      </label>
      <select
        class="input input-bordered"
        id="frequency"
        bind:value={frequency}
        required
      >
        <option value="">--Please choose an option--</option>
        <option value="weekly">Weekly</option>
        <option value="biweekly">Biweekly</option>
        <option value="semimonthly">Semimonthly</option>
        <option value="monthly">Monthly</option>
        <option value="single-time">Single Time</option>
      </select>
    </div>

    <button class="btn btn-primary mt-4" disabled={$loading}>Add Income</button>
  </form>

  <!-- Add a button to navigate back to the dashboard -->
  <a href="/dashboard" class="btn btn-outline mt-4">Back to Dashboard</a>
</div>
