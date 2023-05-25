<script>
 export let bill;
 export let deleteBill;
  let modalOpen = false;

  const confirmDelete = async () => {
    //calling deleteBill function from dashboard page
    await deleteBill(bill.id);
    modalOpen = false;
  };
</script>

<div class="card bordered mb-4">
  <!--creating delete button to be used in dashboard page-->
  <!-- Add this button inside each card -->
  <button class="btn btn-error" on:click={() => (modalOpen = true)}
    >Delete</button
  >

  <!-- DaisyUI Modal -->
  {#if modalOpen}
    <div class="modal modal-open">
      <div class="modal-box">
        <h2 class="text-xl">Confirm Deletion</h2>
        <p>Are you sure you want to delete {bill.billName}?</p>
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
    <h2 class="card-title">{bill.billName}</h2>
    <p>Due Amount: {bill.formattedDueAmount}</p>
    <p>Due Date: {bill.dueDate}</p>
    <p>Frequency: {bill.frequency}</p>
  </div>
</div>
