import { query } from './db-connection.js';

// Create a new announcement
async function createAnnouncement(announcementData) {
  const insertQuery = `
    INSERT INTO announcements (title, content)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const params = [
    announcementData.title,
    announcementData.content
  ];

  try {
    const result = await query(insertQuery, params);
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('Error in createAnnouncement:', error.message);
    throw new Error('Failed to create announcement.');
  }
}

// Get all announcements with pagination
async function getAllAnnouncements(limit = 50, offset = 0) {
  try {
    const result = await query(
      `
      SELECT 
        a.id,
        a.title,
        a.content,
        a.created_at,
        a.updated_at,
        'Admin' as created_by_username
      FROM announcements a
      ORDER BY a.created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    return { success: true, data: result.rows };
  } catch (error) {
    console.error('Error in getAllAnnouncements:', error.message);
    throw new Error('Failed to fetch announcements.');
  }
}

// Get total count of announcements
async function getAnnouncementsCount() {
  try {
    const result = await query('SELECT COUNT(*) as count FROM announcements');
    return { success: true, count: parseInt(result.rows[0].count) };
  } catch (error) {
    console.error('Error in getAnnouncementsCount:', error.message);
    throw new Error('Failed to get announcements count.');
  }
}

// Get a single announcement by ID
async function getAnnouncementById(id) {
  try {
    const result = await query(
      `
      SELECT 
        a.id,
        a.title,
        a.content,
        a.created_at,
        a.updated_at,
        'Admin' as created_by_username
      FROM announcements a
      WHERE a.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Announcement not found.');
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('Error in getAnnouncementById:', error.message);
    throw new Error('Failed to fetch announcement.');
  }
}

// Update an announcement
async function updateAnnouncement(id, announcementData) {
  const updateQuery = `
    UPDATE announcements 
    SET title = $1, content = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING *;
  `;

  const params = [
    announcementData.title,
    announcementData.content,
    id
  ];

  try {
    const result = await query(updateQuery, params);
    
    if (result.rows.length === 0) {
      throw new Error('Announcement not found.');
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('Error in updateAnnouncement:', error.message);
    throw new Error('Failed to update announcement.');
  }
}

// Delete an announcement
async function deleteAnnouncement(id) {
  try {
    const result = await query(
      'DELETE FROM announcements WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Announcement not found.');
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('Error in deleteAnnouncement:', error.message);
    throw new Error('Failed to delete announcement.');
  }
}

// Search announcements by title or content
async function searchAnnouncements(searchTerm, limit = 50, offset = 0) {
  try {
    const result = await query(
      `
      SELECT 
        a.id,
        a.title,
        a.content,
        a.created_at,
        a.updated_at,
        'Admin' as created_by_username
      FROM announcements a
      WHERE a.title ILIKE $1 OR a.content ILIKE $1
      ORDER BY a.created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [`%${searchTerm}%`, limit, offset]
    );

    return { success: true, data: result.rows };
  } catch (error) {
    console.error('Error in searchAnnouncements:', error.message);
    throw new Error('Failed to search announcements.');
  }
}

export {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementsCount,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  searchAnnouncements
};
