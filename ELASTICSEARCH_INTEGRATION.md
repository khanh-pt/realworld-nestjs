# Elasticsearch Integration for RealWorld NestJS

## Overview

This implementation adds comprehensive Elasticsearch search functionality to the RealWorld NestJS application, providing advanced article search capabilities with full-text search, filtering, sorting, and aggregations.

## What's Been Implemented

### 1. Dependencies Installed

- `@nestjs/elasticsearch` - NestJS Elasticsearch module
- `@elastic/elasticsearch` - Official Elasticsearch client
- `@types/elasticsearch` - TypeScript definitions

### 2. Configuration Setup

- **Elasticsearch Config Type** (`src/config/elasticsearch-config.type.ts`)
- **Elasticsearch Config** (`src/config/elasticsearch.config.ts`)
- **Environment Variables Support**:
  - `ELASTICSEARCH_NODE` - Elasticsearch server URL (default: http://localhost:9200)
  - `ELASTICSEARCH_USERNAME` - Optional authentication username
  - `ELASTICSEARCH_PASSWORD` - Optional authentication password
  - `ELASTICSEARCH_API_KEY` - Optional API key authentication
  - `ELASTICSEARCH_MAX_RETRIES` - Max retry attempts (default: 3)
  - `ELASTICSEARCH_REQUEST_TIMEOUT` - Request timeout in ms (default: 30000)
  - `ELASTICSEARCH_PING_TIMEOUT` - Ping timeout in ms (default: 3000)
  - `ELASTICSEARCH_ARTICLE_INDEX` - Index name (default: articles)

### 3. Article Search Module

- **ArticleSearchService** - Core search functionality
- **ArticleSearchController** - REST API endpoints
- **Search DTOs** - Request/Response data structures
- **Module Integration** - Integrated with existing API structure

### 4. Search Features

#### Full-Text Search

- Search across article title, description, and body
- Relevance scoring with boost factors (title^3, description^2, body^1)
- Fuzzy matching for typo tolerance

#### Advanced Filtering

- Filter by author username
- Filter by tags
- Filter by users who favorited articles
- Date range filtering capabilities

#### Sorting Options

- Relevance (when search query provided)
- Creation date (newest/oldest)
- Update date (newest/oldest)

#### Aggregations

- Tag aggregations (most popular tags in results)
- Author aggregations (most prolific authors in results)

#### Search Highlights

- Highlighted search terms in title, description, and body
- Configurable fragment size and count

### 5. Real-Time Synchronization

- **Create Article**: Automatically indexes new articles
- **Update Article**: Updates Elasticsearch index when articles are modified
- **Delete Article**: Removes articles from Elasticsearch index
- **Error Handling**: Non-blocking sync (search failures don't break main functionality)

## API Endpoints

### Search Articles

```
GET /api/articles/search
```

**Query Parameters:**

- `q` - Search query (optional)
- `author` - Filter by author username (optional)
- `tag` - Filter by tag (optional)
- `favorited` - Filter by favorited user (optional)
- `limit` - Results per page (1-100, default: 20)
- `offset` - Skip results (default: 0)
- `sortBy` - Sort field: relevance|createdAt|updatedAt (default: relevance)
- `sortOrder` - Sort order: asc|desc (default: desc)

**Example Requests:**

```bash
# Basic text search
GET /api/articles/search?q=javascript tutorial

# Filter by author and tag
GET /api/articles/search?author=john_doe&tag=tutorial

# Paginated results
GET /api/articles/search?q=react&limit=10&offset=20

# Sort by creation date
GET /api/articles/search?sortBy=createdAt&sortOrder=desc
```

**Response Format:**

```json
{
  "articles": [
    {
      "id": 1,
      "slug": "how-to-train-your-dragon",
      "title": "How to train your dragon",
      "description": "Ever wonder how?",
      "body": "It takes a Jacobian",
      "highlights": {
        "title": ["How to <em>train</em> your dragon"],
        "description": ["Ever wonder <em>how</em>?"],
        "body": ["It takes a <em>Jacobian</em>"]
      },
      "tagList": ["dragons", "training"],
      "createdAt": "2016-02-18T03:22:56.637Z",
      "updatedAt": "2016-02-18T03:48:35.824Z",
      "favorited": false,
      "favoritesCount": 0,
      "author": {
        "username": "jake",
        "bio": "I work at statefarm",
        "image": "https://i.stack.imgur.com/xHWG8.jpg",
        "following": false
      },
      "score": 0.95
    }
  ],
  "articlesCount": 1,
  "searchMeta": {
    "total": 100,
    "took": 15,
    "maxScore": 0.95
  },
  "aggregations": {
    "tags": [
      { "key": "javascript", "doc_count": 25 },
      { "key": "tutorial", "doc_count": 18 }
    ],
    "authors": [
      { "key": "john_doe", "doc_count": 5 },
      { "key": "jane_doe", "doc_count": 3 }
    ]
  }
}
```

## Elasticsearch Index Configuration

### Document Structure

```json
{
  "articleId": 123,
  "slug": "article-slug",
  "title": "Article Title",
  "description": "Article description",
  "body": "Article content...",
  "tagList": ["tag1", "tag2"],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "author": {
    "id": 1,
    "username": "author_name",
    "bio": "Author bio",
    "image": "author_image_url"
  },
  "favoritesCount": 5,
  "favoritedBy": [1, 2, 3]
}
```

### Index Mapping

- **Text Analysis**: Custom analyzer with lowercase, stop words, and snowball stemming
- **Field Types**: Optimized for search and aggregations
- **Nested Objects**: Author information stored as nested object

## Setup Instructions

### 1. Environment Variables

Add to your `.env` file:

```env
# Elasticsearch Configuration
ELASTICSEARCH_NODE=http://localhost:9200
# Optional authentication
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme
# Or use API key
ELASTICSEARCH_API_KEY=your_api_key_here
```

### 2. Start Elasticsearch

Using Docker Compose (add to your docker-compose.yml):

```yaml
services:
  elasticsearch:
    image: elasticsearch:8.8.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
      - xpack.security.enabled=false
    ports:
      - '9200:9200'
      - '9300:9300'
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

volumes:
  elasticsearch_data:
```

### 3. Initial Data Sync

To index existing articles, you can create a migration script or use the bulk indexing method:

```typescript
npm run index:articles
```

## Testing

### Unit Tests

The service includes proper error handling and logging. Test the search functionality:

```typescript
// Example test
describe('ArticleSearchService', () => {
  it('should search articles by query', async () => {
    const result = await articleSearchService.searchArticles({
      q: 'javascript',
      limit: 10,
      offset: 0,
    });

    expect(result.articles).toBeDefined();
    expect(result.searchMeta.total).toBeGreaterThanOrEqual(0);
  });
});
```

### Integration Testing

Test the complete flow:

1. Create an article via API
2. Search for it using Elasticsearch
3. Update the article
4. Verify updates in search results
5. Delete the article
6. Verify removal from search

## Performance Considerations

### Index Optimization

- Uses custom analyzers for better text analysis
- Keyword fields for exact matching (tags, usernames)
- Proper field mappings for aggregations

### Query Optimization

- Multi-match queries with field boosting
- Efficient filtering using term queries
- Pagination support for large result sets

### Monitoring

- Built-in logging for all Elasticsearch operations
- Error handling that doesn't break main application flow
- Health check on module initialization

## Troubleshooting

### Common Issues

1. **Connection Failed**: Check if Elasticsearch is running and accessible
2. **Index Creation Failed**: Verify Elasticsearch permissions
3. **Search Errors**: Check index existence and mapping
4. **Sync Issues**: Monitor application logs for sync errors

### Debugging

Enable debug logging to see Elasticsearch queries:

```typescript
// In the search service, the logger will show debug information
this.logger.debug(`Searching with query: ${JSON.stringify(searchBody)}`);
```

## Future Enhancements

### Possible Improvements

1. **Advanced Search Syntax**: Support for phrase queries, boolean operators
2. **Search Analytics**: Track popular queries and click-through rates
3. **Autocomplete**: Implement search suggestions and auto-completion
4. **Faceted Search**: Enhanced filtering with range queries for dates
5. **Machine Learning**: Elasticsearch ML features for personalized search
6. **Geospatial Search**: If articles have location data
7. **Multi-language Support**: Language-specific analyzers

### Scaling Considerations

1. **Cluster Setup**: Multi-node Elasticsearch for production
2. **Index Management**: Lifecycle policies for index rotation
3. **Caching**: Add Redis caching for frequent search queries
4. **Load Balancing**: Multiple Elasticsearch nodes with load balancing

This implementation provides a solid foundation for article search functionality while maintaining the existing PostgreSQL-based architecture and following NestJS best practices.
