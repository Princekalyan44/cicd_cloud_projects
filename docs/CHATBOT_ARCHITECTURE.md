# AI Chatbot Architecture

## Overview
The portfolio chatbot uses Retrieval-Augmented Generation (RAG) to provide intelligent, context-aware responses about your professional background, skills, and experience.

## Components

### 1. Chatbot Service (`jasonacox/chatbot`)
- **Base Image**: Pre-built chatbot container
- **Customizations**: Configuration for portfolio-specific use case
- **API**: RESTful endpoints for chat interactions
- **Features**:
  - Natural language understanding
  - Context retention
  - Session management

### 2. PostgreSQL with pgvector
- **Extension**: pgvector for similarity search
- **Tables**:
  ```sql
  -- Resume content embeddings
  CREATE TABLE resume_embeddings (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(1536),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- Conversation history
  CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255),
    user_message TEXT,
    bot_response TEXT,
    context_used TEXT[],
    timestamp TIMESTAMP DEFAULT NOW()
  );

  -- Skills and projects
  CREATE TABLE knowledge_base (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50), -- 'skill', 'project', 'experience', 'education'
    title VARCHAR(255),
    description TEXT,
    embedding vector(1536),
    tags TEXT[],
    metadata JSONB
  );
  ```

### 3. RAG Pipeline

#### Indexing Phase (One-time/Updates)
1. **Document Collection**: Gather resume, projects, skills data
2. **Chunking**: Split into manageable pieces (500-1000 tokens)
3. **Embedding Generation**: Convert text to vectors using embedding model
4. **Storage**: Store in PostgreSQL with pgvector

#### Query Phase (Real-time)
1. **User Query**: "What is your experience with Kubernetes?"
2. **Query Embedding**: Convert question to vector
3. **Similarity Search**: Find top-k relevant chunks from database
   ```sql
   SELECT content, metadata
   FROM knowledge_base
   ORDER BY embedding <=> query_embedding
   LIMIT 5;
   ```
4. **Context Assembly**: Combine retrieved chunks
5. **LLM Generation**: Generate response using context
6. **Response**: Return to user

## Data Flow

```
User Question
     |
     v
[Frontend] --HTTP--> [Chatbot Service]
                           |
                           v
                    Generate Embedding
                           |
                           v
                    [pgvector Search]
                           |
                           v
                    Retrieve Context
                           |
                           v
                    [LLM Generation]
                           |
                           v
                    Store Conversation
                           |
                           v
                    Return Response
```

## Knowledge Base Content

### Personal Information
- Name: Kalyan
- Location: Bangalore, India
- Role: DevOps Engineer
- Experience: 3.5+ years

### Work Experience
```json
{
  "company": "Justdial Ltd.",
  "role": "DevOps Engineer",
  "duration": "Jun 2022 - Jan 2026",
  "responsibilities": [
    "Managed Kubernetes clusters for microservices deployment",
    "Implemented CI/CD pipelines using GitLab and Jenkins",
    "Configured monitoring with Prometheus and Grafana",
    "Automated infrastructure provisioning with Terraform",
    "Linux/RHEL administration and troubleshooting"
  ]
}
```

### Technical Skills
```json
{
  "cloud": ["AWS (EKS, EC2, S3, RDS, Lambda)", "Multi-cloud exposure"],
  "containers": ["Docker", "Kubernetes", "Container orchestration"],
  "cicd": ["Jenkins", "GitLab CI", "GitHub Actions", "ArgoCD"],
  "iac": ["Terraform", "Infrastructure automation"],
  "monitoring": ["Prometheus", "Grafana", "ELK Stack"],
  "service_mesh": ["Istio"],
  "languages": ["Python", "Bash", "Node.js"],
  "linux": ["RHEL", "Ubuntu", "4+ years experience"]
}
```

### Certifications
- AWS Solutions Architect (Valid through 2026)
- CKA (Certified Kubernetes Administrator) - In preparation

### Education
- B.E. Computer Science, Dr. Ambedkar Institute of Technology (2017-2020)
- CGPA: 7.52/10

### Projects
- Enterprise CI/CD pipeline with AWS EKS (current)
- DevOps infrastructure management at Justdial
- AI chatbot development and deployment

## Sample Conversations

### Example 1: Experience Query
**User**: "What is your Kubernetes experience?"

**RAG Process**:
1. Retrieve chunks about Kubernetes from knowledge base
2. Context: "Managed Kubernetes clusters at Justdial", "EKS deployment", "CKA certification prep"
3. Generate: "I have 3.5+ years of hands-on Kubernetes experience..."

### Example 2: Skills Query
**User**: "Do you know Terraform?"

**RAG Process**:
1. Retrieve Terraform-related content
2. Context: "Infrastructure as Code", "Terraform automation at Justdial"
3. Generate: "Yes, I use Terraform extensively for infrastructure provisioning..."

## Deployment Configuration

### Environment Variables for Chatbot
```yaml
env:
  - name: DATABASE_URL
    value: "postgresql://user:pass@postgres-svc:5432/portfolio"
  - name: PGVECTOR_ENABLED
    value: "true"
  - name: EMBEDDING_MODEL
    value: "sentence-transformers/all-MiniLM-L6-v2"
  - name: MAX_CONTEXT_LENGTH
    value: "2000"
  - name: TEMPERATURE
    value: "0.7"
```

### Resource Requirements
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "2Gi"
    cpu: "1000m"
```

## Security Considerations
- Rate limiting on API endpoints
- Input sanitization
- No PII storage in conversation logs
- Encrypted database connections
- Vault-managed secrets

## Monitoring
- Chatbot response latency
- Query success rate
- Database query performance
- Embedding generation time
- User engagement metrics
