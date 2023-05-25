<script>
  // import necessary functions and variables
  import { onMount } from "svelte";
  import { auth, db } from "$lib/firebase";
  //import collections and documents
  import {
    collection,
    deleteDoc,
    doc,
    documentId,
    getDoc,
    getDocs,
  } from "firebase/firestore";
  import BillCard from "$lib/BillCard.svelte";
  import IncomeCard from "$lib/IncomeCard.svelte";
  import { loading, totalBills, totalIncome } from "$lib/store";

  //to be filled by onMount
  let bills = [];
  let incomes = [];

  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  let user;

  loading.set(true);

  let deleteBill = async (billId) => {};

  let deleteIncome = async (incomeId) => {};

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      user = u;
      loading.set(false);

      if (user) {
        try {
          const billsCollectionRef = collection(
            db,
            "users",
            auth.currentUser.uid,
            "bills"
          );
          const incomesCollectionRef = collection(
            db,
            "users",
            auth.currentUser.uid,
            "incomes"
          );
          const billsSnapshot = await getDocs(billsCollectionRef);
          const incomesSnapshot = await getDocs(incomesCollectionRef);

          bills = billsSnapshot.docs.map((doc) => {
            let bill = doc.data();
            bill.id = doc.id;
            bill.dueAmount = bill.dueAmount;
            bill.formattedDueAmount = formatter.format(bill.dueAmount);
            return bill;
          });
          incomes = incomesSnapshot.docs.map((doc) => {
            let income = doc.data();
            income.id = doc.id;
            income.formattedAmount = formatter.format(income.amount);
            return income;
          });

          totalIncome.set(
            incomes.reduce((acc, income) => {
              return acc + income.amount;
            }, 0)
          );
          totalBills.set(
            bills.reduce((acc, bill) => {
              return acc + bill.dueAmount;
            }, 0)
          );
          //modify the deleteBill function to delete a bill from the database
          deleteBill = async (billId) => {
            await deleteDoc(
              doc(db, "users", auth.currentUser.uid, "bills", billId)
            );
            bills = bills.filter((bill) => bill.id !== billId);
            totalBills.set(
              bills.reduce((acc, bill) => {
                return acc + bill.dueAmount;
              }, 0)
            );
          };
          //modify the deleteIncome function to delete an income from the database
          deleteIncome = async (incomeId) => {
            await deleteDoc(
              doc(db, "users", auth.currentUser.uid, "incomes", incomeId)
            );
            incomes = incomes.filter((income) => income.id !== incomeId);
            totalIncome.set(
              incomes.reduce((acc, income) => {
                return acc + income.amount;
              }, 0)
            );
          };
        } catch (error) {
          console.log(error);
        }
      } else {
        loading.set(false);
      }
    });

    return () => {
      unsubscribe();
    };
  });
</script>

<div class="p-4 overflow-x-hidden">
  {#if $loading}
    <div class="alert flex flex-col items-center justify-center min-h-screen">
      <div
        class=" alert-info loading-circle w-10 h-10 rounded-full border-accent border-2"
      />
      <p class="text-accent text-xl font-bold">Loading...</p>
    </div>
  {:else if user}
    <!--create a button to go back to home page, convert hello text to navbar-->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold mb-4">Hello {user.displayName}!</h1>
      <a class="btn btn-outline" href="/">Go back to home page</a>
    </div>
    <div class="shadow grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-8">
      <div class="card bordered bg-primary">
        <figure class="stat">
          <figcaption class="text-primary-content text-2xl font-bold">
            Total Income
          </figcaption>
          <div class="stat-figure stat-value">${$totalIncome}</div>
        </figure>
      </div>
      <div class="card bordered bg-secondary">
        <figure class="stat">
          <figcaption class="text-2xl font-bold text-secondary-content">
            Total Expenses
          </figcaption>
          <div class="stat-value">${$totalBills}</div>
        </figure>
      </div>
      <div class="card bordered bg-accent">
        <figure class="stat">
          <figcaption class="text-accent-content text-2xl font-bold">
            Available Balance
          </figcaption>
          <div class="stat-value">${$totalIncome - $totalBills}</div>
        </figure>
      </div>
    </div>
    <div class="dashboard-content">
      <!--center btn group justify between on only small screens-->
      <div class="btn-group flex md:justify-center mb-8 justify-between">
        <a class="btn btn-primary" href="/addBill">Add New Bill</a>
        <a class="btn btn-outline" href="/addIncome">Add New Income</a>
      </div>

      <h1 class="text-2xl font-bold mb-4">Your Bills</h1>

      <div class="carousel card-bordered rounded-lg gap-4 border-2 bg-base-200">
        {#each bills as bill (bill.id)}
          <div class="carousel-item bg-neutral">
            <BillCard {bill} {deleteBill} />
            <div class="card-footer">
              <button
                class="btn btn-success"
                on:click={() => deleteBill(bill.id)}>Mark as Paid</button
              >
            </div>
          </div>
        {/each}
      </div>

      <div class="divider" />

      <h1 class="text-2xl font-bold mb-4 mt-4">Your Incomes</h1>
      <div class="carousel card-bordered rounded-lg gap-4 border-2 bg-base-200">
        {#each incomes as income (income.id)}
          <div class="carousel-item bg-neutral">
            <IncomeCard {income} {deleteIncome} />
            <div class="card-footer">
            
              >
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">You are not logged in!</h1>
      <a href="/">Go back to the root page</a>
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

  .dashboard-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
