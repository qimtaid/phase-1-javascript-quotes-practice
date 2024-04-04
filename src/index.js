const quoteList = document.getElementById("quote-list");
const newQuoteForm = document.getElementById("new-quote-form");

async function fetchQuotes() {
  const response = await fetch("http://localhost:3000/quotes?_embed=likes");
  const quotes = await response.json();
  renderQuotes(quotes);
}

function renderQuotes(quotes) {
  quoteList.innerHTML = ""; // Clear existing quotes

  quotes.forEach((quote) => {
    const quoteCard = document.createElement("li");
    quoteCard.classList.add("quote-card");

    const blockquote = document.createElement("blockquote");
    blockquote.classList.add("blockquote");

    const quoteText = document.createElement("p");
    quoteText.classList.add("mb-0");
    quoteText.textContent = quote.quote;

    const quoteFooter = document.createElement("footer");
    quoteFooter.classList.add("blockquote-footer");
    quoteFooter.textContent = quote.author;

    const likeButton = document.createElement("button");
    likeButton.classList.add("btn", "btn-success");
    likeButton.textContent = `Likes: ${quote.likes.length}`;
    likeButton.addEventListener("click", () => handleLikeClick(quote.id));

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => handleDeleteClick(quote.id));

    blockquote.appendChild(quoteText);
    blockquote.appendChild(quoteFooter);
    blockquote.appendChild(document.createElement("br"));
    blockquote.appendChild(likeButton);
    blockquote.appendChild(deleteButton);

    quoteCard.appendChild(blockquote);
    quoteList.appendChild(quoteCard);
  });
}

async function handleLikeClick(quoteId) {
  const response = await fetch("http://localhost:3000/likes", {
    method: "POST",
    body: JSON.stringify({ quoteId }),
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    fetchQuotes(); // Re-fetch quotes to update like count
  } else {
    console.error("Error creating like:", response.statusText);
  }
}

async function handleDeleteClick(quoteId) {
  const response = await fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    fetchQuotes(); // Re-fetch quotes to remove deleted quote
  } else {
    console.error("Error deleting quote:", response.statusText);
  }
}

newQuoteForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission

  const newQuote = document.getElementById("new-quote").value;
  const newAuthor = document.getElementById("author").value;

  const response = await fetch("http://localhost:3000/quotes", {
    method: "POST",
    body: JSON.stringify({ quote: newQuote, author: newAuthor }),
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    fetchQuotes(); // Re-fetch quotes to include the new quote
    newQuoteForm.reset(); // Clear form after successful submission
  } else {
    console.error("Error creating quote:", response.statusText);
  }
});

fetchQuotes();
