# GraphQL Query Examples

This file contains example GraphQL queries and mutations that can be used with the GraphQL Playground.

## Queries

### Get All Books

```graphql
query {
  books {
    id
    title
    isbn
    summary
    publishedDate
    createdAt
    updatedAt
  }
}
```

### Get All Books with Authors

```graphql
query {
  booksWithAuthor {
    id
    title
    isbn
    summary
    publishedDate
    author {
      id
      name
      createdAt
      updatedAt
    }
  }
}
```

### Get Single Book

```graphql
query {
  book(id: "book-uuid-here") {
    id
    title
    isbn
    summary
    publishedDate
  }
}
```

### Get Single Book with Author

```graphql
query {
  bookWithAuthor(id: "book-uuid-here") {
    id
    title
    isbn
    summary
    publishedDate
    author {
      id
      name
    }
  }
}
```

### Search Books

```graphql
query {
  searchBooks(input: { title: "NestJS", author: "John", isbn: "978-1234567890" }) {
    id
    title
    isbn
    summary
    author {
      name
    }
  }
}
```

### Get All Authors

```graphql
query {
  authors {
    id
    name
    createdAt
    updatedAt
  }
}
```

### Get Single Author

```graphql
query {
  author(id: "author-uuid-here") {
    id
    name
    books {
      id
      title
      isbn
    }
  }
}
```

## Mutations

### Create Book

```graphql
mutation {
  createBook(
    input: {
      title: "GraphQL with NestJS"
      authorId: "author-uuid-here"
      isbn: "978-1234567890"
      summary: "Learn how to implement GraphQL in NestJS applications"
      publishedDate: "2024-01-01"
    }
  ) {
    id
    title
    isbn
    summary
    publishedDate
    author {
      id
      name
    }
  }
}
```

### Update Book

```graphql
mutation {
  updateBook(id: "book-uuid-here", input: { title: "Updated Book Title", summary: "Updated summary" }) {
    id
    title
    isbn
    summary
    updatedAt
  }
}
```

### Delete Book

```graphql
mutation {
  deleteBook(id: "book-uuid-here")
}
```

### Create Author

```graphql
mutation {
  createAuthor(input: { name: "John Doe" }) {
    id
    name
    createdAt
    updatedAt
  }
}
```

### Update Author

```graphql
mutation {
  updateAuthor(id: "author-uuid-here", input: { name: "Jane Doe" }) {
    id
    name
    updatedAt
  }
}
```

### Delete Author

```graphql
mutation {
  deleteAuthor(id: "author-uuid-here")
}
```

## Complex Queries

### Get Author with All Books

```graphql
query {
  author(id: "author-uuid-here") {
    id
    name
    books {
      id
      title
      isbn
      summary
      publishedDate
    }
  }
}
```

### Search and Filter Books

```graphql
query {
  searchBooks(input: { title: "GraphQL" }) {
    id
    title
    isbn
    summary
    publishedDate
    author {
      id
      name
      books {
        id
        title
      }
    }
  }
}
```

## Variables Usage

You can also use variables for dynamic queries:

```graphql
query GetBook($id: String!) {
  book(id: $id) {
    id
    title
    isbn
    summary
    author {
      name
    }
  }
}
```

Variables:

```json
{
  "id": "book-uuid-here"
}
```

## Error Handling

The GraphQL API returns proper error responses:

```json
{
  "errors": [
    {
      "message": "Book not found",
      "extensions": {
        "code": "NOT_FOUND",
        "originalError": {
          "message": "Book not found",
          "statusCode": 404,
          "error": "Not Found"
        }
      }
    }
  ]
}
```
