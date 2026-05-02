# Search & Upload Features Documentation

## Overview
The Keen Document Intelligence Platform frontend now includes fully functional search and upload capabilities with real-time filtering and mock data integration.

## Search Functionality

### Real-Time Document Filtering
- **Location**: Dashboard page (`/dashboard`)
- **Features**:
  - Search query filters across document titles, previews, and tags
  - Case-insensitive matching for better UX
  - Live preview of filtered results as you type
  - Empty state with helpful message when no results found

### Implementation Details
```typescript
const filteredDocuments = documents.filter((doc) =>
  doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  doc.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
  doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
)
```

### Search Results Tab
- Filters semantic search results in real-time
- Shows relevance percentage for each match
- Empty state when no results match the query
- Integrates with main search bar for consistent UX

### Key Features
- **Dynamic Filtering**: Results update instantly as you type
- **Multi-field Search**: Searches title, preview, and tags simultaneously
- **No Results Handling**: Graceful empty states with helpful messaging
- **Relevance Display**: Shows match confidence percentage for each result

## Upload Functionality

### Upload Dialog Modal
- **Trigger**: "Upload Document" button in dashboard header
- **Features**:
  - Document title input field (required)
  - File selector with drag-and-drop styling
  - File name preview
  - Cancel and Upload buttons with disabled states during upload

### Upload Process Flow
1. User clicks "Upload Document" button
2. Modal opens with form fields
3. User enters document title
4. User selects or drags file
5. Click Upload button
6. Loading animation shows progress (800ms simulation)
7. New document added to top of document list
8. Modal closes and form resets

### Mock Data Integration
```typescript
const newDoc = {
  id: String(documents.length + 1),
  title: uploadTitle,
  preview: 'Newly uploaded document. Analysis and insights will be generated automatically...',
  tags: ['new', 'uploaded'],
  relevance: 0.95,
  date: new Date().toISOString().split('T')[0],
}
setDocuments([newDoc, ...documents])
```

### State Management
- Uses React hooks (useState) for managing:
  - `documents`: Array of all documents (updates on upload)
  - `uploadTitle`: Input field value
  - `uploadFile`: Selected file object
  - `showUploadModal`: Modal visibility toggle
  - `isUploading`: Loading state during upload

### UI/UX Features
- Disabled state for inputs during upload
- Loading indicator ("Uploading..." button text)
- Upload button disabled until title is entered
- Modal backdrop click doesn't close (proper modal pattern)
- Smooth animations and transitions

## Component Integration

### Dashboard Page Structure
```
Dashboard
├── Header
│   ├── Search Input (triggers filtering)
│   └── Upload Button (opens modal)
├── Tabs (Documents | Search Results)
│   ├── Filtered Documents List
│   └── Filtered Search Results List
└── Upload Modal
    ├── Title Input
    ├── File Upload
    └── Action Buttons
```

### State Flow
1. User types in search input → `setSearchQuery()`
2. Filtered arrays computed → `filteredDocuments` and `filteredSearchResults`
3. UI re-renders with filtered data
4. Upload button clicked → `setShowUploadModal(true)`
5. Form filled → updates `uploadTitle` and `uploadFile` state
6. Upload clicked → `handleUpload()` adds new document to `documents` array

## Styling & Responsiveness

### Search & Filter
- Responsive input field with icon
- Real-time feedback during search
- Consistent with design system colors

### Upload Modal
- Centered fixed position overlay
- Dark background with transparency (bg-black/50)
- Card-based modal for consistent styling
- Responsive width (max-w-md) with padding on mobile
- File upload area with dashed border and hover effects

### Empty States
- Consistent icon and messaging
- Muted colors for visual hierarchy
- Center-aligned for balance

## Features Ready for Backend Integration

When backend is added, these features can easily connect to:
- **Search API**: Replace filter logic with API call to semantic search endpoint
- **Upload API**: Post to `/api/documents/upload` with FormData
- **Real-time Updates**: Maintain same state management pattern

## Mock Data Structure

### Document Object
```typescript
{
  id: string,
  title: string,
  preview: string,
  tags: string[],
  relevance: number (0-1),
  date: string (YYYY-MM-DD)
}
```

### Search Result Object
```typescript
{
  id: string,
  title: string,
  snippet: string,
  relevance: number (0-1)
}
```

## User Experience Flow

### Search Flow
1. User arrives at dashboard
2. Sees list of documents
3. Types in search box
4. Documents filter in real-time
5. User can click document to view details (ready for detail page)
6. Switch to "Search Results" tab for semantic search results
7. Results also filter based on main search query

### Upload Flow
1. User clicks "Upload Document" button
2. Modal slides in with smooth animation
3. User enters document title (required)
4. User selects file (shows filename)
5. Uploads file
6. 800ms loading animation
7. Modal closes
8. New document appears at top of list with "new" and "uploaded" tags
9. Can immediately search for newly uploaded document

## Accessibility Considerations

- Input fields properly labeled
- File input has associated label element
- Button states clearly indicated (disabled state)
- Empty states provide context for screen readers
- Color contrast meets WCAG standards (purple/indigo theme)
- Modal uses proper semantic HTML and backdrop

## Performance Notes

- Filtering happens on client-side (instant for < 10k documents)
- State updates trigger minimal re-renders
- File upload shows progress during 800ms simulation
- Modal uses React conditional rendering (not display: none)

## Future Enhancement Opportunities

1. **Advanced Filters**: Add date range, tag filters, relevance thresholds
2. **Bulk Upload**: Drag multiple files at once
3. **Upload Progress**: Show actual file upload progress
4. **Search History**: Remember recent searches
5. **Saved Searches**: Save frequently used queries
6. **Sort Options**: Sort by date, relevance, or alphabetically
7. **Keyboard Shortcuts**: Cmd+K for search, Cmd+U for upload
8. **Debounced Search**: Optimize API calls when backend added
9. **File Preview**: Show document preview before final upload
10. **Batch Operations**: Delete or tag multiple documents at once
