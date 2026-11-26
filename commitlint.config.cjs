module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Subjects start with requirement IDs (e.g. "BKG-02 prevent double booking"),
    // which the default case rule rejects.
    "subject-case": [0],
  },
};
