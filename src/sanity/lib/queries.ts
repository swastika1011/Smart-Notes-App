import { defineQuery } from "next-sanity";

export const NOTES_QUERY = defineQuery(`*[
  _type == "notes" && defined(slug.current) && (
      !defined($search) ||
      title match $search ||
      category match $search ||
      author->name match $search ||
      author->country match $search ||
      author->universityName match $search
    )
] | order(_createdAt desc) {
  _id, 
  _type,
  _createdAt,
  _updatedAt,
  _rev,

  title, 
  slug,
  _createdAt,
  author -> {
    _id,
    name,
    image,
    bio,
    country,
  universityName,
  }, 
  views,
  description,
  category,
  image,
  file{
    asset-> {
      _id,
      url
    }
  }
}`);

export const NOTES_BY_ID_QUERY =
  defineQuery(`*[_type == "notes" && _id == $id][0]{
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, username, image, bio
  }, 
  views,
  description,
  category,
  image,
  file{
    asset-> {
      _id,
      url
    }
  }
}`);
export const NOTES_VIEWS_QUERY = defineQuery(`
    *[_type == "notes" && _id == $id][0]{
        _id, views
    }
`);
export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
*[_type == "author" && id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
}
`);
export const AUTHOR_BY_ID_QUERY = defineQuery(`
*[_type == "author" && _id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
}
`);
export const NOTES_BY_AUTHOR_QUERY =
  defineQuery(`*[_type == "notes" && author._ref == $id] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
}`);
