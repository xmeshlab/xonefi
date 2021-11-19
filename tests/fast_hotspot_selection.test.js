const { TestScheduler } = require("jest");
const fhs = require("../api/fast_hotspot_selection");

test('fast_hostpost_selection algorithm always chooses the best hotspot', () => {
    let results1 = {
        ssids: [
            "OFAIgRDMCoAAMUUPRhCQD6AIchXEJL",
            "OFAKgRDMCoAAMUUPRhCQD6AIchXEJL",
            "OFAMgRDMCoAAMUUPRhCQD6AIchXEJL"
        ],
        rssis: [
            255,
            254,
            253
        ]
    }

    let results2 = {
        ssids: [
            "OFAIgRDMCoAAMUUPRhCQD6AIchXEJL",
            "OFAIgRDMCoAAMUUPRhCQD6AIchXEJL",
            "OFAIgRDMCoAAMUUPRhCQD6AIchXEJL"
        ],
        rssis: [
            160,
            233.1,
            233
        ]
    };

    let results3 = {
        ssids: [
            "OFAKgRDMCoAAMUUAAAABn6AIchXEJL",
            "OFAMgRDMCoAAMUUAAAABn6AIchXEJL",
            "OFAOgRDMCoAAMUUPRhCQD6AIchXEJL"
        ],
        rssis: [
            100,
            200,
            250
        ]
    };

    expect(fhs.fast_hotspot_selection_ng(results1)).toBe(0);
    expect(fhs.fast_hotspot_selection_ng(results2)).toBe(1);
    expect(fhs.fast_hotspot_selection_ng(results3)).toBe(2);

});