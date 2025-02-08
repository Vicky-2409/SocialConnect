"use client";
import React, { useEffect, useState, useRef } from "react";
import { Search as SearchIcon, Users, FileText, Loader2 } from "lucide-react";
import userService from "@/utils/apiCalls/userService";
import UserSearch from "./UserSearch";
import PostsSearch from "./PostsSearch";
import postService from "@/utils/apiCalls/postService";

function Search() {
  const [isUserSearch, setIsUserSearch] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [postResults, setPostResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (keyword.trim()) {
      setIsLoading(true);
      debounceTimeoutRef.current = setTimeout(() => {
        handleSearch();
      }, 300);
    } else {
      setUserResults([]);
      setPostResults([]);
      setIsLoading(false);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [keyword, isUserSearch]);

  async function handleSearch() {
    try {
      if (isUserSearch) {
        const results = await userService.searchUsers(keyword);
        setUserResults(results);
      } else {
        const results = await postService.searchPost(keyword);
        setPostResults(results);
      }
    } catch (error) {
      console.error("Search error:", error);
      if (isUserSearch) {
        setUserResults([]);
      } else {
        setPostResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearchTypeChange = (isUsers: boolean) => {
    if (isUsers !== isUserSearch) {
      setIsUserSearch(isUsers);
      if (keyword.trim()) {
        setIsLoading(true);
        handleSearch();
      }
      setKeyword("");
    }
  };

  const currentResults = isUserSearch ? userResults : postResults;

  return (
    <div className="max-w-2xl mx-auto p-4 w-full">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl 
                     text-gray-900 dark:text-gray-100 placeholder-gray-500 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder={`Search ${isUserSearch ? "people" : "posts"}...`}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* Search Type Toggle */}
        <div className="flex mt-4 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
          <button
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg gap-2
                     transition-all ${
                       isUserSearch
                         ? "bg-white dark:bg-gray-800 shadow-sm"
                         : "text-gray-500 dark:text-gray-400"
                     }`}
            onClick={() => handleSearchTypeChange(true)}
          >
            <Users className="h-4 w-4" />
            <span className="font-medium">People</span>
          </button>
          <button
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg gap-2
                     transition-all ${
                       !isUserSearch
                         ? "bg-white dark:bg-gray-800 shadow-sm"
                         : "text-gray-500 dark:text-gray-400"
                     }`}
            onClick={() => handleSearchTypeChange(false)}
          >
            <FileText className="h-4 w-4" />
            <span className="font-medium">Posts</span>
          </button>
        </div>

        {/* Results Section */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : keyword ? (
            currentResults.length > 0 ? (
              <div className="space-y-2">
                {isUserSearch ? (
                  <UserSearch results={currentResults} />
                ) : (
                  <PostsSearch results={currentResults} />
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No {isUserSearch ? "people" : "posts"} found for "{keyword}"
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Search;
