import React from "react";

function Filter(filters) {
  // Contoh penggunaan
  const filterObject = {
    filter_type: "AND",
    filters: filters,
    groups: [],
  };

  const encodedFilters = encodeURIComponent(JSON.stringify(filterObject));
  return `user_field_names=true&filters=${encodedFilters}`;
}

export default Filter;
