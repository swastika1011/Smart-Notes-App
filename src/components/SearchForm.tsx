import React from 'react'
import Form from "next/form";
import SearchFormReset from './SearchFormReset';
import { Search } from 'lucide-react';

const SearchForm = ({query}: {query?: string} )  => {
  return (
    <Form action={"/"} scroll={false} className='search-form font-body'>
    <input 
    name = "query"
    defaultValue={""}
    className='search-input'
    placeholder='Search Notes'
    />
    <div className='flex gap-2'>
        {query && <SearchFormReset/>}
        <button type='submit' className='search-btn text-white  hover:-translate-y-0.5
    transition-all
    duration-200' >
           <Search className="size-4" />
        </button>


    </div>
    </Form>
  )
}

export default SearchForm