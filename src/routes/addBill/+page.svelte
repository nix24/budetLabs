<script>
  import { goto } from "$app/navigation";
  import { db, auth } from "$lib/firebase";
  //import firestore collection
  import { collection, addDoc, doc } from "firebase/firestore";
  import { loading } from "$lib/store";
  let billName = "";
  let dueAmount = 0;
  let dueDate = "";
  let frequency = "";

  const addBill = async () => {
    // add code to store the bill in Firebase
    // use the same format as the incomes
    loading.set(true);
    try {
      const billsCollectionRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "bills"
      );
      await addDoc(billsCollectionRef, {
        billName,
        dueAmount,
        dueDate,
        frequency,
      });

      // Redirect to dashboard
      alert(`Bill: ${billName} added!`);
      loading.set(false);
      goto("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };
</script>

<div class="p-4">
  <h1 class="text-2xl font-bold mb-4">Add New Bill</h1>

  <form on:submit|preventDefault={addBill}>
    <div class="form-control">
      <label class="label" for="billName">
        <span class="label-text">Bill Name</span>
      </label>
      <input
        class="input input-bordered"
        type="text"
        id="billName"
        bind:value={billName}
        required
      />
    </div>

    <!-- Due Amount -->
    <div class="form-control">
      <label class="label" for="dueAmount">
        <span class="label-text">Due Amount</span>
      </label>
      <input
        class="input input-bordered"
        type="number"
        id="dueAmount"
        bind:value={dueAmount}
        required
      />
    </div>

    <!-- Due Date -->
    <div class="form-control">
      <label class="label" for="dueDate">
        <span class="label-text">Due Date</span>
      </label>
      <input
        class="input input-bordered"
        type="date"
        id="dueDate"
        bind:value={dueDate}
        required
      />
    </div>

    <!-- Frequency -->
    <div class="form-control">
      <label class="label" for="frequency">
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

    <button class="btn btn-primary mt-4" disabled={$loading}>Add Bill</button>
  </form>
  <a href="/dashboard" class="btn btn-outline mt-4">Back to Dashboard</a>
</div>
