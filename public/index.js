document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const postId = parseInt(this.getAttribute("data-id")); // ✅ Convert to number

      try {
        const response = await fetch(`/delete`, {
          // ✅ Use new /delete route
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });

        const data = await response.json();
        console.log("data from index.js"+data)

        if (data.success) {
          location.reload(); // Reload page after successful deletion
        } else {
          console.error("Error deleting post:", data.message);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    });
  });
});

// editing logic
document.querySelectorAll(".update-btn").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const postId = event.target.getAttribute("data-id"); // Get post ID
    window.location.href = `/update?postId=${postId}`; // Redirect to edit page
  });
});



