const User = require("../models/user");

async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({});
  res.setHeader("X-myName", "pranav");
  console.log(req.headers);
  const html = `
     <ul>
        ${allDbUsers
          .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
          .join("")}
     </ul>
    `;
  res.send(html);
}

async function handelGetUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) res.status(404).json({ err: "user not found" });
  return res.json(user);
}

async function handelPutUpdateUserById(req, res) {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      email: req.body.email,
      gender: req.body.gender,
      jobTitle: req.body.job_title
    },
    { new: true }
  );
  if (!user) {
    return res.status(404).json({ msg: "user not found" });
  }
  return res.json({ msg: "sucesss" });
}

async function handelPatchUpdateUserById(req, res) {
  await User.findByIdAndUpdate(req.params.id, { lastName: "changed" });
  return res.json({ msg: "success" });
}

async function handelDeleteUserById(req, res) {
  await User.findByIdAndDelete(req.params.id);
  return res.json({ msg: "success" });
}

async function handelCreateUserById(req, res) {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "all fields are require" });
  }
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  console.log(result);
  return res.status(201).json({ msg: "success" });
}

module.exports = {
  handleGetAllUsers,
  handelGetUserById,
  handelPutUpdateUserById,
  handelPatchUpdateUserById,
  handelDeleteUserById,
  handelCreateUserById,
};
