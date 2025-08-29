# GraphQL Implementation

This document describes the GraphQL implementation added to the NestJS microservice framework, following KISS, SOLID, and DRY principles along with NestJS best practices.

## Overview

The GraphQL implementation provides a type-safe, efficient API layer that complements the existing REST endpoints. It uses the code-first approach with automatic schema generation.

## Architecture

### 1. Configuration (`src/app/config/graphql.config.ts`)

- Centralized GraphQL configuration
- Auto-schema generation with sorting
- GraphQL Playground enabled for development
- Custom error formatting for better debugging

### 2. GraphQL Objects (`src/app/*/entities/*.graphql.ts`)

- Separate GraphQL object types from database entities
- Follows single responsibility principle
- Type-safe field definitions with proper nullable handling

### 3. Input Types (`src/app/*/dto/*.input.ts`)

- Dedicated input types for mutations
- Validation decorators for type safety
- Reusable partial types for updates

### 4. Resolvers (`src/app/*/resolvers/*.resolver.ts`)

- Clean separation of concerns
- Proper dependency injection
- Field resolvers for related data
- Efficient N+1 query prevention

## Features

### Books API

- **Queries:**

  - `books`: Get all books
  - `booksWithAuthor`: Get all books with author information
  - `book(id)`: Get a specific book
  - `bookWithAuthor(id)`: Get a specific book with author
  - `searchBooks(input)`: Search books with filters

- **Mutations:**
  - `createBook(input)`: Create a new book
  - `updateBook(id, input)`: Update an existing book
  - `deleteBook(id)`: Delete a book

### Authors API

- **Queries:**

  - `authors`: Get all authors
  - `author(id)`: Get a specific author

- **Mutations:**
  - `createAuthor(input)`: Create a new author
  - `updateAuthor(id, input)`: Update an existing author
  - `deleteAuthor(id)`: Delete an author

## Example Queries

### Get all books with authors

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
    }
  }
}
```

### Search books

```graphql
query {
  searchBooks(input: { title: "NestJS", author: "John" }) {
    id
    title
    isbn
    author {
      name
    }
  }
}
```

### Create a book

```graphql
mutation {
  createBook(
    input: {
      title: "GraphQL with NestJS"
      authorId: "author-uuid"
      isbn: "978-1234567890"
      summary: "Learn GraphQL with NestJS"
      publishedDate: "2024-01-01"
    }
  ) {
    id
    title
    author {
      name
    }
  }
}
```

## Best Practices Implemented

### 1. KISS (Keep It Simple, Stupid)

- Clear, readable resolver methods
- Minimal configuration
- Straightforward naming conventions

### 2. SOLID Principles

- **Single Responsibility**: Each resolver handles one entity
- **Open/Closed**: Easy to extend with new fields and resolvers
- **Liskov Substitution**: Proper inheritance with input types
- **Interface Segregation**: Focused resolver interfaces
- **Dependency Inversion**: Proper dependency injection

### 3. DRY (Don't Repeat Yourself)

- Reusable input types with `PartialType`
- Shared validation decorators
- Common error handling patterns

### 4. NestJS Best Practices

- Code-first approach with automatic schema generation
- Proper module organization
- Type-safe decorators
- Efficient field resolvers
- Centralized error handling

## Error Handling

The implementation includes:

- Custom GraphQL exception filter
- Proper error formatting
- Type-safe error responses
- Development-friendly error messages

## Performance Considerations

- Field resolvers prevent N+1 queries
- Efficient database queries with relations
- Caching integration ready
- Lazy loading of related data

## Development

### Starting the GraphQL Playground

1. Start the application: `pnpm start:dev`
2. Navigate to: `http://localhost:3000/graphql`
3. Use the interactive playground to test queries and mutations

### Schema Generation

The GraphQL schema is automatically generated and saved to `src/schema.gql` when the application starts.

## Testing

GraphQL resolvers can be tested using:

- Unit tests with Jest
- Integration tests with the GraphQL playground
- E2E tests with supertest

## Future Enhancements

- Authentication and authorization
- Subscriptions for real-time updates
- DataLoader for batch loading
- GraphQL federation for microservices
- Performance monitoring and metrics
