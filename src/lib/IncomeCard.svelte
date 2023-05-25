<script>
  export let income;
  export let deleteIncome;
  let modalOpen = false;

  const confirmDelete = async () => {
    //calling deleteIncome function from dashboard page
    await deleteIncome(income.id);
    modalOpen = false;
  };
</script>

<div class="card bordered mb-4">
  <!--creating delete button to be used in dashboard page-->
  <button class="btn btn-error" on:click={() => (modalOpen = true)}
    >Delete</button
  >

  <!-- DaisyUI Modal -->
  {#if modalOpen}
    <div class="modal modal-open">
      <div class="modal-box">
        <h2 class="text-xl">Confirm Deletion</h2>
        <p>Are you sure you want to delete {income.sourceName}?</p>
        <div class="modal-action">
          <button class="btn" on:click={() => (modalOpen = false)}
            >Cancel</button
          >
          <button class="btn btn-error" on:click={confirmDelete}>Delete</button>
        </div>
      </div>
    </div>
  {/if}
  <div class="card-body">
    <h2 class="card-title">{income.sourceName}</h2>
    <p>Amount: {income.formattedAmount}</p>
    <p>Pay Date: {income.payDate}</p>
    <p>Frequency: {income.frequency}</p>
  </div>
</div>
