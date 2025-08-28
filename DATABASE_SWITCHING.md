# Database ORM Switching

This project supports both TypeORM and Drizzle ORM for database operations. You can easily switch between them using environment variables.

## Configuration

Set the `ORM` environment variable to choose your preferred ORM:

```bash
# Use Drizzle ORM (default)
ORM=drizzle

# Use TypeORM
ORM=typeorm
```

## Architecture

### Database Modules

- **`DatabaseModule`**: Main database module that can switch between ORMs
- **`DrizzleModule`**: Drizzle ORM specific module
- **`TypeOrmDatabaseModule`**: TypeORM specific module

### Repository Pattern

Each entity has its own repository:

- `BookDrizzleRepository` - Drizzle implementation
- `BookRepository` (TypeORM) - TypeORM implementation

### Service Layer

Services are ORM-agnostic and work with any repository implementation.

## Switching ORMs

1. **Set Environment Variable**:

   ```bash
   export ORM=typeorm  # or ORM=drizzle
   ```

2. **Update Database Module** (if needed):

   ```typescript

   static forRoot(): DynamicModule {
     return {
       module: DatabaseModule,
       imports: [
         DrizzleModule,

       ],
     };
   }
   ```

3. **Update Entity Modules**:

   ```typescript
   providers: [BookDrizzleRepository, BookService];

   providers: [BookRepository, BookService];
   ```

## Benefits

- **Consistency**: Both ORMs follow the same module structure
- **Flexibility**: Easy to switch between ORMs for different use cases
- **Maintainability**: Clear separation of concerns
- **Testing**: Can test with different ORMs easily

## Example Usage

```typescript
@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookDrizzleRepository, private readonly authorService: AuthorService) {}

  async findAll(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }
}
```
