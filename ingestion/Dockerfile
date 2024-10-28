
FROM rust:1.81.0

WORKDIR /app

COPY Cargo.toml .

# Copy the actual source code
COPY . .

# Build the application
RUN cargo build --release

# Set the command to run the ingestion program
CMD ["./target/release/ingestion"]
