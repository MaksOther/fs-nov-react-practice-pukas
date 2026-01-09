export const UserList = ({ products }) => (
  <tbody>
    {products.map(product => (
      <tr data-cy="Product" key={product.id}>
        <td className="has-text-weight-bold" data-cy="ProductId">
          {product.id}
        </td>

        <td data-cy="ProductName">{product.name}</td>
        <td data-cy="ProductCategory">
          {product.category.icon} - {product.category.title}
        </td>

        <td
          data-cy="ProductUser"
          className={
            product.user.sex === 'm' ? 'has-text-link' : 'has-text-danger'
          }
        >
          {product.user.name}
        </td>
      </tr>
    ))}
  </tbody>
);
