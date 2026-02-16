export const SUBJECTS = [
    { id: "1", name: "ENGLISH", code: "ENGLISH" },
    { id: "2", name: "MATHS", code: "MATHS" },
    { id: "3", name: "SCIENCE", code: "SCIENCE" }
];

export const BATCHES = [
    { id: "1", name: "A" },
    { id: "2", name: "B" },
    { id: "3", name: "C" }
];

export const CLASSES = [
    { id: "1", name: "1", batches: [BATCHES[0], BATCHES[1]] },
    { id: "2", name: "2", batches: [BATCHES[0], BATCHES[1]] },
    { id: "3", name: "3", batches: [BATCHES[0], BATCHES[1], BATCHES[2]] }
];

export const getSubjectDetails = (subject) => {
    const nameToFind = typeof subject === 'string' ? subject : (subject.name || subject.id);
    const found = SUBJECTS.find(s =>
        (s.name && s.name.toUpperCase() === nameToFind.toString().toUpperCase()) ||
        (s.id && s.id === nameToFind.toString())
    );

    return found ? { id: found.id, name: found.name } : { id: "0", name: nameToFind };
};
