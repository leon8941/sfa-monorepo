async function getUsers() {
  const resp = await fetch('http://localhost:3000/api/users');

  return resp.json();
}

export default async function User() {
  const users = await getUsers();
  return <h1 className="text-3xl font-bold">User Count: {users.length}</h1>;
}
