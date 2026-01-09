/* eslint-disable*/
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { UserList } from './components/userList';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    cat => cat.id === product.categoryId,
  );
  const user = usersFromServer.find(user => user.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [categorySelected, setCategorySelected] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(null); // 'id', 'name', 'category', 'user'

  function handleCategorySelected(categoryId) {
    if (categorySelected.includes(categoryId)) {
      setCategorySelected(categorySelected.filter(id => id !== categoryId));
    } else {
      setCategorySelected([...categorySelected, categoryId]);
    }
  }

  function getFilteredProducts() {
    return products.filter(product => {
      const isCategoryMatch =
        categorySelected.length === 0 ||
        categorySelected.includes(product.category.id);

      const isUserMatch =
        selectedUserId === null || product.user.id === selectedUserId;

      const isSearch = product.name
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase().trim());

      return isCategoryMatch && isUserMatch && isSearch;
    });
  }

  function handleSort(field) {
    switch (sortBy) {
      case `${field}Asc`:
        setSortBy(`${field}Desc`);

        return;

      case `${field}Desc`:
        setSortBy('');

        return;

      default:
        setSortBy(`${field}Asc`);
    }
  }

  function sortProducts(currentProducts, sortType) {
    if (!sortType) {
      return currentProducts;
    }

    return [...currentProducts].sort((a, b) => {
      switch (sortType) {
        case 'idAsc':
          return a.id - b.id;
        case 'idDesc':
          return b.id - a.id;

        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);

        case 'categoryAsc':
          return a.category.title.localeCompare(b.category.title);
        case 'categoryDesc':
          return b.category.title.localeCompare(a.category.title);

        case 'userAsc':
          return a.user.name.localeCompare(b.user.name);
        case 'userDesc':
          return b.user.name.localeCompare(a.user.name);

        default:
          return 0;
      }
    });
  }

  const filteredProducts = getFilteredProducts();
  const visibleProducts = sortProducts(filteredProducts, sortBy);

  function resetAllFilters() {
    setCategorySelected([]);
    setSelectedUserId(null);
    setSearch('');
    setSortBy(null);
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUserId(null)}
                className={selectedUserId === null ? 'is-active' : ''}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUserId === user.id ? 'is-active' : ''}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className={search.length !== 0 ? 'delete' : ''}
                    onClick={() => setSearch('')}
                  />
                </span>
              </p>
            </div>
            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button mr-6 is-success${categorySelected.length === 0 ? '' : 'is-outlined'}`}
                onClick={() => setCategorySelected([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-2 ${categorySelected.includes(category.id) ? 'is-info' : ''}`}
                  href="#/"
                  onClick={() => handleCategorySelected(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => resetAllFilters()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={`fas ${
                              sortBy === 'idAsc'
                                ? 'fa-sort-up'
                                : sortBy === 'idDesc'
                                  ? 'fa-sort-down'
                                  : 'fa-sort'
                            }`}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th onClick={() => handleSort('name')}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={`fas ${
                              sortBy === 'nameAsc'
                                ? 'fa-sort-up'
                                : sortBy === 'nameDesc'
                                  ? 'fa-sort-down'
                                  : 'fa-sort'
                            }`}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th onClick={() => handleSort('category')}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={`fas ${
                              sortBy === 'categoryAsc'
                                ? 'fa-sort-up'
                                : sortBy === 'categoryDesc'
                                  ? 'fa-sort-down'
                                  : 'fa-sort'
                            }`}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th onClick={() => handleSort('user')}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={`fas ${
                              sortBy === 'userAsc'
                                ? 'fa-sort-up'
                                : sortBy === 'userDesc'
                                  ? 'fa-sort-down'
                                  : 'fa-sort'
                            }`}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>
              <UserList products={visibleProducts} />
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
