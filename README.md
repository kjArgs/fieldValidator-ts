# kristan1 Input Validator

A lightweight, TypeScript-based input validation library for Node.js applications. Perfect for validating form inputs, API payloads, and request data with minimal overhead.

[![npm version](https://img.shields.io/npm/v/kristan1-input-validator.svg)](https://www.npmjs.com/package/kristan1-input-validator)
[![License](https://img.shields.io/npm/l/kristan1-input-validator.svg)](https://github.com/kristan1/fieldValidator-ts/blob/main/LICENSE)

## Features

✨ **Lightweight** - Minimal dependencies, fast validation  
🎯 **Type-Safe** - Full TypeScript support with proper type definitions  
🔌 **Express Middleware** - Easy integration with Express.js  
🛡️ **Simple API** - Intuitive validation rules and error handling  
📦 **No Dependencies** - Uses only built-in Node.js modules (except Express for middleware)  
🚀 **Easy to Use** - Works with both direct validation and middleware patterns

## Installation

Install via npm:

```bash
npm install kristan1-input-validator
```

Or with yarn:

```bash
yarn add kristan1-input-validator
```

## Quick Start

### Using with Express Middleware

```typescript
import express from "express";
import { validate, ValidationSchema } from "kristan1-input-validator";

const app = express();
app.use(express.json());

const loginSchema: ValidationSchema = {
  email: { required: true, minLength: 5 },
  password: { required: true, minLength: 8 },
};

// Apply validation middleware
app.post("/login", validate(loginSchema), (req, res) => {
  // If validation passes, data is in req.body
  res.json({ success: true, user: req.body.email });
});

// Request with invalid data returns 400
// POST /login with { email: "test" }
// Response: 400 Bad Request
// {
//   "message": "Validation failed",
//   "errors": { "password": "password is required" }
// }
```

### Direct Validation

```typescript
import { fieldChecker, ValidationSchema } from "kristan1-input-validator";

const schema: ValidationSchema = {
  email: { required: true, minLength: 5 },
  password: { required: true, minLength: 8 },
};

const userData = {
  email: "user@example.com",
  password: "shortpass",
};

const result = fieldChecker(userData, schema);

if (!result.isValid) {
  console.log("Validation errors:", result.errors);
} else {
  console.log("Data is valid!");
}
```

## API Documentation

### `fieldChecker(fields, schema)`

Validates data against a schema and returns detailed results.

**Parameters:**

- `fields` (Record<string, any>): The data to validate
- `schema` (ValidationSchema): The validation rules

**Returns:**

```typescript
{
  isValid: boolean;
  errors: Record<string, string>;
}
```

**Example:**

```typescript
const result = fieldChecker(userData, schema);
// {
//   isValid: false,
//   errors: {
//     password: "password must be at least 8 characters"
//   }
// }
```

### `validate(schema)`

Express middleware factory for automatic request validation.

**Parameters:**

- `schema` (ValidationSchema): The validation rules

**Returns:** Express middleware function

**Example:**

```typescript
app.post("/register", validate(registerSchema), (req, res) => {
  // Only reached if validation passes
  res.json({ message: "Registration successful" });
});
```

## Validation Rules

### ValidationSchema Type

```typescript
export type ValidationSchema = Record<string, FieldRule>;

export type FieldRule = {
  required?: boolean; // Field must be present and not empty
  minLength?: number; // Minimum string length
};
```

### Supported Rules

| Rule        | Type    | Description                                      |
| ----------- | ------- | ------------------------------------------------ |
| `required`  | boolean | Field must be present and have a non-empty value |
| `minLength` | number  | String value must have minimum character length  |

### Example Schema

```typescript
const userSchema: ValidationSchema = {
  firstName: { required: true, minLength: 2 },
  lastName: { required: true, minLength: 2 },
  email: { required: true, minLength: 5 },
  age: { required: true },
  bio: { minLength: 10 }, // Optional field, but if provided must be at least 10 chars
};
```

## Usage Examples

### Example 1: User Registration

```typescript
import express, { Request, Response } from "express";
import { fieldChecker, ValidationSchema } from "kristan1-input-validator";

const app = express();
app.use(express.json());

const registrationSchema: ValidationSchema = {
  username: { required: true, minLength: 3 },
  email: { required: true, minLength: 5 },
  password: { required: true, minLength: 8 },
};

app.post("/register", (req: Request, res: Response) => {
  const result = fieldChecker(req.body, registrationSchema);

  if (!result.isValid) {
    return res.status(400).json({
      success: false,
      errors: result.errors,
    });
  }

  // Process registration
  res.status(201).json({
    success: true,
    message: "Registration successful",
    user: req.body,
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

### Example 2: Using Middleware

```typescript
import express from "express";
import { validate, ValidationSchema } from "kristan1-input-validator";

const app = express();
app.use(express.json());

const productSchema: ValidationSchema = {
  name: { required: true, minLength: 3 },
  price: { required: true },
  description: { required: true, minLength: 10 },
};

// Validation happens automatically before route handler
app.post("/products", validate(productSchema), (req, res) => {
  // Data is guaranteed to be valid here
  saveProductToDatabase(req.body);
  res.status(201).json({ message: "Product created" });
});
```

### Example 3: Custom Validation Logic

```typescript
import { fieldChecker, ValidationSchema } from "kristan1-input-validator";

const schema: ValidationSchema = {
  email: { required: true, minLength: 5 },
  confirmEmail: { required: true, minLength: 5 },
};

function validateUserData(data: any) {
  // First, use fieldChecker for basic validation
  const result = fieldChecker(data, schema);

  if (!result.isValid) {
    return { valid: false, errors: result.errors };
  }

  // Add custom validation logic
  if (data.email !== data.confirmEmail) {
    return {
      valid: false,
      errors: { confirmEmail: "Emails do not match" },
    };
  }

  return { valid: true };
}
```

### Example 4: With MongoDB/Mongoose

```typescript
import express from "express";
import { fieldChecker, ValidationSchema } from "kristan1-input-validator";
import { User } from "./models/User";

const app = express();
app.use(express.json());

const userSchema: ValidationSchema = {
  name: { required: true, minLength: 2 },
  email: { required: true, minLength: 5 },
  age: { required: true },
};

app.post("/users", async (req, res) => {
  // Validate input first
  const validation = fieldChecker(req.body, userSchema);

  if (!validation.isValid) {
    return res.status(400).json({
      error: "Validation failed",
      errors: validation.errors,
    });
  }

  try {
    // Then save to database
    const user = await User.create(req.body);
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});
```

## Error Handling

### Middleware Error Response

When using the `validate` middleware, failed validation returns:

```json
{
  "message": "Validation failed",
  "errors": {
    "email": "email is required",
    "password": "password must be at least 8 characters"
  }
}
```

HTTP Status: **400 Bad Request**

### Manual Validation Error Handling

```typescript
const result = fieldChecker(data, schema);

if (!result.isValid) {
  // Handle errors
  Object.entries(result.errors).forEach(([field, message]) => {
    console.log(`${field}: ${message}`);
  });
}
```

## Type Definitions

Full TypeScript support is included with built-in type definitions:

```typescript
import {
  ValidationSchema,
  FieldRule,
  fieldChecker,
  validate,
} from "kristan1-input-validator";

// Properly typed schema
const mySchema: ValidationSchema = {
  name: { required: true, minLength: 2 },
};

// Type-safe fieldChecker call
const result = fieldChecker(data, mySchema);
// result.isValid: boolean
// result.errors: Record<string, string>
```

## Project Structure

```
validator-lib/
├── src/
│   ├── core/
│   │   └── fieldValidator.ts      # Core validation logic
│   ├── middlewares/
│   │   └── validate.ts            # Express middleware
│   ├── types/
│   │   └── validation.ts          # Type definitions
│   └── index.ts                   # Main export
├── dist/                          # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## Future Enhancements

Planned features for future versions:

- Pattern/regex validation
- Type checking (email, number, date, etc.)
- Custom validation functions
- Nested object validation
- Array validation support
- Maximum length validation
- Default values

## License

ISC

## Author

**kristan1**

## Support

For issues, questions, or feedback, please visit the [GitHub repository](https://github.com/kristan1/fieldValidator-ts).

---

**Made with ❤️ for better input validation**
