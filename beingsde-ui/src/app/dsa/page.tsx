"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
  GitBranch,
  Cpu,
  BookOpen,
  CheckCircle2,
  Zap,
  AlertTriangle,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Tab = "ds" | "algo";
type Difficulty = "Medium";

interface DSAQuestion {
  id: number;
  title: string;
  tag: string;
  difficulty: Difficulty;
  summary: string;
  keyPoints: string[];
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  pattern: string;
}

// ─────────────────────────────────────────────
// Data Structures Questions (45)
// ─────────────────────────────────────────────
const dsQuestions: DSAQuestion[] = [
  // Arrays
  {
    id: 1,
    title: "Find the majority element in an array (appears > n/2 times)",
    tag: "Array",
    difficulty: "Medium",
    summary: "Identify the element that appears more than half the times in an array without using extra space.",
    keyPoints: [
      "Boyer-Moore Voting Algorithm reduces to O(1) space",
      "Maintain a candidate and counter; increment/decrement as you scan",
      "Verify the candidate in a second pass if not guaranteed to exist",
    ],
    approach: "Boyer-Moore Voting: pick a candidate, sweep through incrementing count for a match and decrementing otherwise. When count hits 0, replace candidate.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Boyer-Moore Voting",
  },
  {
    id: 2,
    title: "Product of array except self",
    tag: "Array",
    difficulty: "Medium",
    summary: "Return an array where each element is the product of all other elements — no division allowed.",
    keyPoints: [
      "Build prefix products left-to-right into the result array",
      "Then sweep right-to-left maintaining a running suffix product",
      "Combine: result[i] = prefix[i] × suffix[i]",
    ],
    approach: "Two-pass: left-to-right pass fills prefix products, right-to-left pass multiplies in suffix products using a single running variable.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) extra (output array excluded)",
    pattern: "Prefix / Suffix Product",
  },
  {
    id: 3,
    title: "Maximum subarray sum (Kadane's Algorithm)",
    tag: "Array",
    difficulty: "Medium",
    summary: "Find the contiguous subarray with the largest sum.",
    keyPoints: [
      "currentMax = max(num, currentMax + num)",
      "globalMax tracks the best seen so far",
      "Handles all-negative arrays by returning the largest single element",
    ],
    approach: "Kadane's: at each index decide whether to extend the current subarray or start a new one.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Kadane's / Dynamic Programming",
  },
  {
    id: 4,
    title: "3Sum — find all unique triplets that sum to zero",
    tag: "Array",
    difficulty: "Medium",
    summary: "Return all unique triplets [a, b, c] such that a + b + c = 0.",
    keyPoints: [
      "Sort the array first",
      "Fix one element, then use two-pointer on the remaining sorted segment",
      "Skip duplicates carefully for the fixed element and both pointers",
    ],
    approach: "Sort + Two-Pointer: O(n²) overall, skipping duplicate values at each pointer to avoid duplicate triplets.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1) (excluding output)",
    pattern: "Two Pointers",
  },
  {
    id: 5,
    title: "Container with Most Water",
    tag: "Array",
    difficulty: "Medium",
    summary: "Given heights of vertical lines, find two that together with the x-axis form a container holding the most water.",
    keyPoints: [
      "Start with widest possible container (left=0, right=n-1)",
      "Always move the pointer with the shorter height inward",
      "Area = min(h[left], h[right]) × (right - left)",
    ],
    approach: "Greedy Two-Pointer: the width decreases with each move, so always sacrifice the smaller height to potentially gain more from height.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Two Pointers / Greedy",
  },
  {
    id: 6,
    title: "Find all duplicates in an array (values in [1, n])",
    tag: "Array",
    difficulty: "Medium",
    summary: "Find every element that appears twice without extra space.",
    keyPoints: [
      "Use array indices as a hash — negate nums[abs(nums[i])-1]",
      "If already negative when you visit, that index+1 is a duplicate",
      "Works only when values are in [1, n]",
    ],
    approach: "Index-as-hash: mark visited positions by negating; a second visit to an already-negative slot reveals the duplicate.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Index Marking",
  },
  {
    id: 7,
    title: "Spiral order traversal of a matrix",
    tag: "Array / Matrix",
    difficulty: "Medium",
    summary: "Traverse an m×n matrix in spiral (clockwise) order.",
    keyPoints: [
      "Maintain four boundaries: top, bottom, left, right",
      "Traverse right → down → left → up, shrinking boundaries after each direction",
      "Stop when top > bottom or left > right",
    ],
    approach: "Boundary simulation: advance each boundary inward after completing each direction sweep.",
    timeComplexity: "O(m×n)",
    spaceComplexity: "O(1) extra",
    pattern: "Simulation / Boundary Shrinking",
  },
  {
    id: 8,
    title: "Rotate an n×n matrix in-place by 90°",
    tag: "Array / Matrix",
    difficulty: "Medium",
    summary: "Rotate a square matrix 90° clockwise without using extra space.",
    keyPoints: [
      "Step 1: Transpose the matrix (swap matrix[i][j] with matrix[j][i])",
      "Step 2: Reverse each row",
      "These two steps compose to a 90° clockwise rotation",
    ],
    approach: "Transpose + Row-Reverse. Both steps are O(n²) and in-place.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    pattern: "Matrix Manipulation",
  },
  {
    id: 9,
    title: "Subarray sum equals K",
    tag: "Array / HashMap",
    difficulty: "Medium",
    summary: "Count the number of contiguous subarrays whose sum equals k.",
    keyPoints: [
      "prefixSum[j] - prefixSum[i] = k → prefixSum[i] = prefixSum[j] - k",
      "Use a HashMap to store counts of each prefix sum seen so far",
      "For every new prefix sum, look up (prefixSum - k) in the map",
    ],
    approach: "Prefix sum + HashMap: running sum enables O(1) lookup of the complement prefix sum.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    pattern: "Prefix Sum + HashMap",
  },
  {
    id: 10,
    title: "Longest consecutive sequence",
    tag: "Array / HashSet",
    difficulty: "Medium",
    summary: "Find the length of the longest consecutive integers sequence in O(n).",
    keyPoints: [
      "Insert all numbers into a HashSet",
      "Only start counting from a number n where n-1 is NOT in the set",
      "Extend the streak by checking n+1, n+2, … in the set",
    ],
    approach: "HashSet: skip non-sequence-starts to ensure each element is visited at most twice total.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    pattern: "HashSet",
  },
  // Linked Lists
  {
    id: 11,
    title: "Detect and find the start of a cycle in a linked list",
    tag: "Linked List",
    difficulty: "Medium",
    summary: "Determine if a linked list has a cycle and return the node where it begins.",
    keyPoints: [
      "Floyd's slow (1 step) and fast (2 steps) pointers meet inside the cycle",
      "Move one pointer back to head; advance both one step at a time",
      "They meet again exactly at the cycle start",
    ],
    approach: "Floyd's Tortoise and Hare — two-phase: detect then locate entry point.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Floyd's Cycle Detection",
  },
  {
    id: 12,
    title: "Reorder linked list: L0→L1→…→Ln becomes L0→Ln→L1→Ln-1→…",
    tag: "Linked List",
    difficulty: "Medium",
    summary: "Reorder a linked list in-place by interleaving from front and back.",
    keyPoints: [
      "Find the middle using slow/fast pointers",
      "Reverse the second half",
      "Merge the two halves alternately",
    ],
    approach: "Three-step: find mid → reverse second half → merge.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Slow/Fast Pointer + In-place Reversal",
  },
  {
    id: 13,
    title: "Remove the Nth node from the end of a linked list",
    tag: "Linked List",
    difficulty: "Medium",
    summary: "Delete the Nth node from the end in one pass.",
    keyPoints: [
      "Use two pointers: advance the first pointer N+1 steps ahead",
      "Then advance both until first reaches null",
      "Second pointer is now at the node before the target; update next pointer",
    ],
    approach: "Two-pointer with N-step lead: one pass, O(n).",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Two Pointers",
  },
  {
    id: 14,
    title: "Add two numbers represented as reversed linked lists",
    tag: "Linked List",
    difficulty: "Medium",
    summary: "Sum two numbers stored digit-by-digit in reverse order in linked lists.",
    keyPoints: [
      "Traverse both lists simultaneously, summing digits + carry",
      "Create a new node for each digit sum % 10; carry = sum / 10",
      "Don't forget a final carry node after both lists are exhausted",
    ],
    approach: "Simultaneous traversal with carry propagation.",
    timeComplexity: "O(max(m,n))",
    spaceComplexity: "O(max(m,n))",
    pattern: "Simulation",
  },
  {
    id: 15,
    title: "Deep copy a linked list with random pointers",
    tag: "Linked List",
    difficulty: "Medium",
    summary: "Clone a linked list where each node has a next and an arbitrary random pointer.",
    keyPoints: [
      "HashMap approach: map original → clone, then set next and random",
      "In-place approach: interleave clones between originals, set randoms, then detach",
      "In-place is O(1) space but tricky",
    ],
    approach: "HashMap (simpler) or in-place interleaving (O(1) space).",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) HashMap / O(1) in-place",
    pattern: "HashMap / Interleaving",
  },
  // Stacks & Queues
  {
    id: 16,
    title: "Daily temperatures — next warmer day",
    tag: "Stack",
    difficulty: "Medium",
    summary: "For each day, find how many days until a warmer temperature using a monotonic stack.",
    keyPoints: [
      "Maintain a monotonically decreasing stack of indices",
      "When a warmer temperature is found, pop and compute distance",
      "Unresolved indices in stack get 0",
    ],
    approach: "Monotonic Decreasing Stack: each element is pushed and popped at most once.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    pattern: "Monotonic Stack",
  },
  {
    id: 17,
    title: "Largest rectangle in histogram",
    tag: "Stack",
    difficulty: "Medium",
    summary: "Find the largest rectangular area that can be formed within a bar chart.",
    keyPoints: [
      "Use a monotonic increasing stack of bar indices",
      "When a shorter bar is encountered, pop and calculate width from previous stack top",
      "Append a sentinel bar of height 0 to flush the stack at the end",
    ],
    approach: "Monotonic Stack: popping reveals the left boundary for each bar.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    pattern: "Monotonic Stack",
  },
  {
    id: 18,
    title: "Implement a Min Stack with O(1) getMin()",
    tag: "Stack",
    difficulty: "Medium",
    summary: "Design a stack that supports push, pop, top, and retrieving the minimum in O(1).",
    keyPoints: [
      "Maintain a secondary 'min stack' that tracks minimums",
      "Push to min stack when new element ≤ current min; pop synchronously",
      "Alternatively encode the delta from current min in a single stack",
    ],
    approach: "Dual-stack: main stack + auxiliary min stack that only grows when a new minimum is pushed.",
    timeComplexity: "O(1) all ops",
    spaceComplexity: "O(n)",
    pattern: "Auxiliary Stack",
  },
  {
    id: 19,
    title: "Evaluate Reverse Polish Notation (RPN)",
    tag: "Stack",
    difficulty: "Medium",
    summary: "Compute the value of an arithmetic expression in postfix notation.",
    keyPoints: [
      "Push numbers onto the stack",
      "On an operator, pop two operands, apply the operator, push result",
      "Handle integer division that truncates toward zero",
    ],
    approach: "Stack-based evaluation: linear scan, O(n).",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    pattern: "Stack Simulation",
  },
  {
    id: 20,
    title: "Sliding window maximum using a deque",
    tag: "Queue / Deque",
    difficulty: "Medium",
    summary: "Find the maximum in every sliding window of size k in O(n).",
    keyPoints: [
      "Use a monotonic decreasing deque of indices",
      "Remove indices outside the window from the front",
      "Remove smaller elements from the back before adding new element",
    ],
    approach: "Monotonic Deque: the front always holds the index of the current window's max.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    pattern: "Monotonic Deque",
  },
  // Trees
  {
    id: 21,
    title: "Binary tree level-order traversal (BFS)",
    tag: "Tree",
    difficulty: "Medium",
    summary: "Return node values level by level using a queue-based BFS.",
    keyPoints: [
      "Enqueue the root; while queue non-empty process all nodes of current level",
      "Record size of queue at start of each level to know level boundary",
      "Collect results per level into a list of lists",
    ],
    approach: "BFS with level-size tracking.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    pattern: "BFS",
  },
  {
    id: 22,
    title: "Validate a Binary Search Tree",
    tag: "Tree",
    difficulty: "Medium",
    summary: "Determine if a binary tree is a valid BST.",
    keyPoints: [
      "Track valid range [min, max] for each node, not just compare with parent",
      "Left subtree max is bounded by current node's value; right by a minimum",
      "In-order traversal should yield strictly increasing values",
    ],
    approach: "Range-bounded DFS: pass min/max bounds down the recursion.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) recursion stack",
    pattern: "DFS with Bounds",
  },
  {
    id: 23,
    title: "Lowest Common Ancestor (LCA) of a binary tree",
    tag: "Tree",
    difficulty: "Medium",
    summary: "Find the deepest node that is an ancestor of both given nodes.",
    keyPoints: [
      "If current node is p or q, return it",
      "Recurse left and right; if both return non-null, current node is LCA",
      "Otherwise return the non-null result",
    ],
    approach: "Post-order DFS: the first node where both subtrees return hits is the LCA.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    pattern: "Post-order DFS",
  },
  {
    id: 24,
    title: "Binary Tree right side view",
    tag: "Tree",
    difficulty: "Medium",
    summary: "Return the values of the rightmost node at each level.",
    keyPoints: [
      "BFS: take the last element of each level",
      "DFS: pass depth, record node value if depth == result.size()",
      "Right-first DFS naturally visits the rightmost node first at each depth",
    ],
    approach: "BFS (last of each level) or right-first DFS.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    pattern: "BFS / DFS",
  },
  {
    id: 25,
    title: "Diameter of a binary tree",
    tag: "Tree",
    difficulty: "Medium",
    summary: "Find the length of the longest path between any two nodes (may not pass through root).",
    keyPoints: [
      "At each node compute height of left and right subtrees",
      "Diameter through this node = leftHeight + rightHeight",
      "Track global maximum as you recurse",
    ],
    approach: "Post-order DFS: each node returns its height; update global diameter.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    pattern: "Post-order DFS",
  },
  // Tries
  {
    id: 26,
    title: "Implement a Trie (Prefix Tree)",
    tag: "Trie",
    difficulty: "Medium",
    summary: "Design a Trie with insert, search, and startsWith operations.",
    keyPoints: [
      "Each node has a children array (or HashMap) and an isEnd flag",
      "insert traverses/creates nodes for each character",
      "search requires reaching a node with isEnd=true; startsWith just requires reaching the last char node",
    ],
    approach: "Array-of-26 children per node for lowercase English letters; HashMap for arbitrary chars.",
    timeComplexity: "O(L) per op (L = word length)",
    spaceComplexity: "O(ALPHABET_SIZE × total_chars)",
    pattern: "Trie",
  },
  {
    id: 27,
    title: "Word Search in a 2D grid",
    tag: "Trie / Backtracking",
    difficulty: "Medium",
    summary: "Determine if a word can be constructed from adjacent cells in a grid.",
    keyPoints: [
      "DFS/backtracking from every cell that matches word[0]",
      "Mark visited cells temporarily to avoid revisiting",
      "For multiple words: build a Trie and search simultaneously",
    ],
    approach: "DFS + backtracking with visited marking.",
    timeComplexity: "O(m×n×4^L) worst case",
    spaceComplexity: "O(L) recursion stack",
    pattern: "Backtracking",
  },
  // Heaps
  {
    id: 28,
    title: "Kth largest element in a stream",
    tag: "Heap",
    difficulty: "Medium",
    summary: "Design a class that finds the kth largest element after every add().",
    keyPoints: [
      "Maintain a min-heap of size k",
      "The heap root is always the kth largest element",
      "If heap grows beyond k, pop the smallest",
    ],
    approach: "Min-heap of size k: insert and possibly evict O(log k) per add.",
    timeComplexity: "O(log k) per add",
    spaceComplexity: "O(k)",
    pattern: "Min-Heap",
  },
  {
    id: 29,
    title: "Find K closest points to the origin",
    tag: "Heap",
    difficulty: "Medium",
    summary: "Return the K points nearest to (0,0) using Euclidean distance.",
    keyPoints: [
      "Compare squared distances to avoid sqrt",
      "Max-heap of size K: if new point closer than max, replace it",
      "Alternatively quickselect for O(n) average",
    ],
    approach: "Max-heap of size K: evict the farthest point when heap exceeds K.",
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    pattern: "Max-Heap / Quickselect",
  },
  {
    id: 30,
    title: "Task scheduler — minimum CPU intervals with cooldown",
    tag: "Heap / Greedy",
    difficulty: "Medium",
    summary: "Given tasks with a cooldown period n between same task executions, find minimum time to finish all tasks.",
    keyPoints: [
      "Always execute the most frequent remaining task",
      "Formula shortcut: intervals = max(taskCount, (maxFreq-1)×(n+1) + countOfMaxFreq)",
      "Max-heap provides the greedy choice at each step",
    ],
    approach: "Greedy + Max-heap: always schedule the highest-frequency available task.",
    timeComplexity: "O(T log T) — T = total tasks",
    spaceComplexity: "O(1) (26 letters)",
    pattern: "Greedy / Max-Heap",
  },
  // Graphs
  {
    id: 31,
    title: "Number of islands (connected components in grid)",
    tag: "Graph / DFS",
    difficulty: "Medium",
    summary: "Count the number of islands ('1's connected 4-directionally) in a 2D grid.",
    keyPoints: [
      "DFS/BFS from every unvisited '1', marking connected cells as visited",
      "Each DFS invocation represents one island",
      "Can mark cells '0' in-place to avoid separate visited array",
    ],
    approach: "DFS flood fill: sink visited land cells to '0'.",
    timeComplexity: "O(m×n)",
    spaceComplexity: "O(m×n) worst-case recursion",
    pattern: "DFS / Flood Fill",
  },
  {
    id: 32,
    title: "Course schedule — detect cycle in directed graph",
    tag: "Graph / Topological Sort",
    difficulty: "Medium",
    summary: "Determine if you can finish all courses given prerequisites (i.e., no cycle exists).",
    keyPoints: [
      "Model as directed graph; a cycle means impossible",
      "Kahn's algorithm (BFS + in-degree) or DFS with 3-color marking",
      "If topological sort includes all nodes, no cycle exists",
    ],
    approach: "Kahn's BFS: track in-degrees, process zero-in-degree nodes, check count at end.",
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V+E)",
    pattern: "Topological Sort",
  },
  {
    id: 33,
    title: "Clone a graph",
    tag: "Graph / DFS",
    difficulty: "Medium",
    summary: "Deep copy an undirected connected graph.",
    keyPoints: [
      "Use a HashMap<Node, Node> mapping original → clone",
      "DFS/BFS from the start node, creating clones on first visit",
      "For each original neighbor, recursively clone and link",
    ],
    approach: "DFS + HashMap: map acts as both visited set and clone registry.",
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V)",
    pattern: "DFS / HashMap",
  },
  {
    id: 34,
    title: "Rotting oranges — minimum time for all to rot (BFS)",
    tag: "Graph / BFS",
    difficulty: "Medium",
    summary: "Find minimum minutes for all fresh oranges to rot given rotten ones spread each minute.",
    keyPoints: [
      "Multi-source BFS starting from all initially rotten oranges simultaneously",
      "Track remaining fresh oranges count",
      "If fresh count > 0 after BFS, return -1",
    ],
    approach: "Multi-source BFS: enqueue all initial rotten oranges at time 0 and process wave by wave.",
    timeComplexity: "O(m×n)",
    spaceComplexity: "O(m×n)",
    pattern: "Multi-Source BFS",
  },
  {
    id: 35,
    title: "Walls and gates — fill distance to nearest gate",
    tag: "Graph / BFS",
    difficulty: "Medium",
    summary: "Fill each empty room with the distance to its nearest gate using multi-source BFS.",
    keyPoints: [
      "Start BFS from all gates (value 0) simultaneously",
      "The first time a cell is reached is its shortest distance",
      "Walls (value -1) block propagation",
    ],
    approach: "Multi-source BFS from all gates at once.",
    timeComplexity: "O(m×n)",
    spaceComplexity: "O(m×n)",
    pattern: "Multi-Source BFS",
  },
  // Hash Maps & Sets
  {
    id: 36,
    title: "Group anagrams together",
    tag: "HashMap",
    difficulty: "Medium",
    summary: "Cluster strings that are anagrams of each other.",
    keyPoints: [
      "Sort each string to form a canonical key",
      "Use the sorted string as a HashMap key; group original strings under it",
      "Alternative: character-count tuple as key (faster for long strings)",
    ],
    approach: "HashMap with sorted-string keys.",
    timeComplexity: "O(n × k log k) — k = max string length",
    spaceComplexity: "O(n×k)",
    pattern: "Canonical Form / HashMap",
  },
  {
    id: 37,
    title: "Top K frequent elements",
    tag: "HashMap / Heap",
    difficulty: "Medium",
    summary: "Return the k most frequently occurring elements.",
    keyPoints: [
      "Count frequencies in a HashMap",
      "Use a min-heap of size k; evict least frequent",
      "Bucket sort alternative: O(n) using frequency as bucket index",
    ],
    approach: "HashMap + Min-heap of size k, or bucket sort for O(n).",
    timeComplexity: "O(n log k) heap; O(n) bucket",
    spaceComplexity: "O(n)",
    pattern: "HashMap + Heap / Bucket Sort",
  },
  {
    id: 38,
    title: "Longest substring without repeating characters",
    tag: "HashMap / Sliding Window",
    difficulty: "Medium",
    summary: "Find the length of the longest substring with all unique characters.",
    keyPoints: [
      "Sliding window with a HashSet or character-to-index map",
      "When a repeat is found, shrink the window from the left",
      "Track max window size throughout",
    ],
    approach: "Sliding window + HashMap storing last index of each char for O(1) jump.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(n, alphabet))",
    pattern: "Sliding Window + HashMap",
  },
  {
    id: 39,
    title: "Design an LRU Cache",
    tag: "HashMap / Doubly Linked List",
    difficulty: "Medium",
    summary: "Implement a Least Recently Used cache with O(1) get and put.",
    keyPoints: [
      "HashMap for O(1) key lookup, doubly linked list for O(1) eviction order",
      "On get: move node to head (most recent)",
      "On put: add to head; if over capacity, remove tail (least recent)",
    ],
    approach: "HashMap of key → DLL node + sentinel head/tail nodes.",
    timeComplexity: "O(1) get & put",
    spaceComplexity: "O(capacity)",
    pattern: "HashMap + Doubly Linked List",
  },
  // Strings
  {
    id: 40,
    title: "Longest palindromic substring",
    tag: "String",
    difficulty: "Medium",
    summary: "Find the longest contiguous palindromic substring in a string.",
    keyPoints: [
      "Expand-around-center: for each index expand both odd and even centers",
      "Track best start and length seen",
      "DP is O(n²) time & space; expansion is O(n²) time O(1) space",
    ],
    approach: "Expand-around-center: 2n-1 possible centers, O(n) each in worst case.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    pattern: "Expand Around Center",
  },
  {
    id: 41,
    title: "Encode and decode strings (no delimiter in charset)",
    tag: "String",
    difficulty: "Medium",
    summary: "Design encode/decode functions to serialize a list of strings with no guaranteed delimiter.",
    keyPoints: [
      "Prefix each string with its length followed by a fixed separator e.g. '5#hello'",
      "Decode reads the length, then reads exactly that many characters",
      "This handles any characters including the separator",
    ],
    approach: "Length-prefix encoding: `len(s) + '#' + s`.",
    timeComplexity: "O(n) total chars",
    spaceComplexity: "O(n)",
    pattern: "Length-Prefix Encoding",
  },
  {
    id: 42,
    title: "Minimum window substring containing all chars of T",
    tag: "String / Sliding Window",
    difficulty: "Medium",
    summary: "Find the smallest window in S that contains every character in T.",
    keyPoints: [
      "Maintain frequency maps for T and the current window",
      "Expand right until all T chars are covered, then contract left",
      "Track 'formed' counter to know when all required chars are present",
    ],
    approach: "Two-pointer sliding window with frequency maps and a 'formed' count.",
    timeComplexity: "O(|S| + |T|)",
    spaceComplexity: "O(|S| + |T|)",
    pattern: "Sliding Window",
  },
  {
    id: 43,
    title: "Find all anagrams of P in S",
    tag: "String / Sliding Window",
    difficulty: "Medium",
    summary: "Return all starting indices of P's anagrams in S using a fixed-size sliding window.",
    keyPoints: [
      "Fixed window of size len(P) with character frequency comparison",
      "Slide the window, adding new char and removing old char",
      "Use a 'matches' counter to avoid full-array comparison each step",
    ],
    approach: "Fixed-size sliding window with frequency diff counter.",
    timeComplexity: "O(|S|)",
    spaceComplexity: "O(1) (26 chars)",
    pattern: "Fixed Sliding Window",
  },
  // Binary
  {
    id: 44,
    title: "Sum of two integers without + or - operators",
    tag: "Bit Manipulation",
    difficulty: "Medium",
    summary: "Add two integers using only bit operations.",
    keyPoints: [
      "XOR gives the sum without carry",
      "AND << 1 gives the carry",
      "Repeat until carry is 0",
    ],
    approach: "Iterative bit manipulation: sum = a XOR b, carry = (a AND b) << 1.",
    timeComplexity: "O(1) — 32 bits max",
    spaceComplexity: "O(1)",
    pattern: "Bit Manipulation",
  },
  {
    id: 45,
    title: "Number of 1 bits (Hamming weight)",
    tag: "Bit Manipulation",
    difficulty: "Medium",
    summary: "Count set bits in an integer efficiently.",
    keyPoints: [
      "n & (n-1) clears the lowest set bit each iteration",
      "Repeat until n = 0; count iterations",
      "Brian Kernighan's Algorithm: O(number of set bits)",
    ],
    approach: "Brian Kernighan: n = n & (n-1) loop, counting iterations.",
    timeComplexity: "O(k) — k = number of set bits",
    spaceComplexity: "O(1)",
    pattern: "Bit Manipulation",
  },
];

// ─────────────────────────────────────────────
// Algorithm Questions (45)
// ─────────────────────────────────────────────
const algoQuestions: DSAQuestion[] = [
  // Sorting & Searching
  {
    id: 1,
    title: "Search in rotated sorted array",
    tag: "Binary Search",
    difficulty: "Medium",
    summary: "Find a target in a rotated sorted array in O(log n).",
    keyPoints: [
      "One half is always sorted; determine which half and narrow search",
      "If nums[mid] >= nums[left]: left half is sorted",
      "Check if target falls in the sorted half; otherwise search the other half",
    ],
    approach: "Modified binary search: at each step, identify the sorted half and check if target belongs there.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    pattern: "Binary Search",
  },
  {
    id: 2,
    title: "Find minimum in rotated sorted array",
    tag: "Binary Search",
    difficulty: "Medium",
    summary: "Locate the minimum element in a rotated sorted array in O(log n).",
    keyPoints: [
      "The minimum is the inflection point where nums[mid] > nums[right]",
      "If nums[mid] < nums[right]: minimum is in [left, mid]",
      "Continue binary search until left == right",
    ],
    approach: "Binary search comparing mid to right boundary to detect rotation.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    pattern: "Binary Search",
  },
  {
    id: 3,
    title: "Koko eating bananas — find minimum eating speed",
    tag: "Binary Search on Answer",
    difficulty: "Medium",
    summary: "Find the minimum eating speed k such that all piles are eaten within h hours.",
    keyPoints: [
      "Binary search the speed k in [1, max(piles)]",
      "For a given k compute total hours = sum(ceil(pile/k))",
      "If hours ≤ h, try lower speed; else try higher",
    ],
    approach: "Binary search on the answer space.",
    timeComplexity: "O(n log m) — m = max pile",
    spaceComplexity: "O(1)",
    pattern: "Binary Search on Answer",
  },
  {
    id: 4,
    title: "Find peak element in unsorted array",
    tag: "Binary Search",
    difficulty: "Medium",
    summary: "Find an index i such that nums[i] > nums[i-1] and nums[i] > nums[i+1].",
    keyPoints: [
      "Binary search: if nums[mid] < nums[mid+1], peak is to the right",
      "Otherwise peak is at mid or to the left",
      "Boundary elements count as neighbors -∞",
    ],
    approach: "Binary search using the slope direction to narrow the search.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    pattern: "Binary Search",
  },
  {
    id: 5,
    title: "Merge intervals",
    tag: "Sorting",
    difficulty: "Medium",
    summary: "Merge all overlapping intervals from a list.",
    keyPoints: [
      "Sort intervals by start time",
      "Compare each interval's start with the last merged interval's end",
      "If overlapping, extend the end; otherwise push a new interval",
    ],
    approach: "Sort + linear scan.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    pattern: "Sorting + Greedy",
  },
  {
    id: 6,
    title: "Sort colors (Dutch National Flag)",
    tag: "Sorting",
    difficulty: "Medium",
    summary: "Sort an array of 0s, 1s, and 2s in-place in O(n) with one pass.",
    keyPoints: [
      "Three pointers: low, mid, high",
      "0 → swap to low, advance low and mid",
      "2 → swap to high, decrement high; 1 → just advance mid",
    ],
    approach: "Dutch National Flag: partition into three regions.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Three Pointers / Partition",
  },
  // Dynamic Programming
  {
    id: 7,
    title: "Longest increasing subsequence (LIS)",
    tag: "Dynamic Programming",
    difficulty: "Medium",
    summary: "Find the length of the longest strictly increasing subsequence.",
    keyPoints: [
      "DP: dp[i] = max length ending at index i; O(n²)",
      "Binary search + patience sorting: maintain a 'tails' array; O(n log n)",
      "Tails[i] = smallest tail element of all IS of length i+1",
    ],
    approach: "Patience sorting with binary search for O(n log n).",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    pattern: "DP / Binary Search",
  },
  {
    id: 8,
    title: "Coin change — minimum coins to make amount",
    tag: "Dynamic Programming",
    difficulty: "Medium",
    summary: "Find the fewest coins needed to make up a given amount.",
    keyPoints: [
      "dp[i] = min coins to make amount i",
      "dp[0] = 0; dp[i] = min(dp[i - coin] + 1) for each coin ≤ i",
      "If dp[amount] == INT_MAX, return -1",
    ],
    approach: "Bottom-up DP with 1D array.",
    timeComplexity: "O(amount × coins)",
    spaceComplexity: "O(amount)",
    pattern: "Unbounded Knapsack / DP",
  },
  {
    id: 9,
    title: "0/1 Knapsack problem",
    tag: "Dynamic Programming",
    difficulty: "Medium",
    summary: "Maximize value of items placed in a knapsack with weight limit W.",
    keyPoints: [
      "dp[i][w] = max value using first i items with capacity w",
      "For each item: include (value[i] + dp[i-1][w-weight[i]]) or exclude (dp[i-1][w])",
      "1D DP traversing weights backwards avoids reusing the same item",
    ],
    approach: "2D DP optimized to 1D by iterating weights in reverse.",
    timeComplexity: "O(n × W)",
    spaceComplexity: "O(W)",
    pattern: "0/1 Knapsack",
  },
  {
    id: 10,
    title: "Unique paths in a grid",
    tag: "Dynamic Programming",
    difficulty: "Medium",
    summary: "Count all unique paths from top-left to bottom-right moving only right or down.",
    keyPoints: [
      "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
      "First row and column all 1s",
      "Math shortcut: C(m+n-2, m-1) — combinatorics",
    ],
    approach: "2D DP or combinatorics formula.",
    timeComplexity: "O(m×n)",
    spaceComplexity: "O(n) with 1D DP",
    pattern: "Grid DP",
  },
  {
    id: 11,
    title: "Word break — can string be segmented into dictionary words?",
    tag: "Dynamic Programming",
    difficulty: "Medium",
    summary: "Determine if a string can be split into a sequence of dictionary words.",
    keyPoints: [
      "dp[i] = true if s[0..i-1] can be segmented",
      "dp[i] = any dp[j] && s[j..i-1] in dict, for j < i",
      "Put words in a HashSet for O(1) lookup",
    ],
    approach: "Bottom-up DP with HashSet for O(n²) total.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n + dict size)",
    pattern: "DP + HashSet",
  },
  {
    id: 12,
    title: "Decode ways — number of ways to decode a digit string",
    tag: "Dynamic Programming",
    difficulty: "Medium",
    summary: "Count the number of ways to decode a numeric string into letters (A=1 … Z=26).",
    keyPoints: [
      "dp[i] = ways to decode s[0..i-1]",
      "Single digit valid (1-9): dp[i] += dp[i-1]",
      "Two digits valid (10-26): dp[i] += dp[i-2]",
    ],
    approach: "1D DP — Fibonacci-style with validity checks.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) with two variables",
    pattern: "DP",
  },
  {
    id: 13,
    title: "Jump game — can you reach the last index?",
    tag: "Dynamic Programming / Greedy",
    difficulty: "Medium",
    summary: "Determine if you can reach the end of an array where each element is the max jump length.",
    keyPoints: [
      "Greedy: track the furthest index reachable so far",
      "If current index > furthest, return false (gap exists)",
      "If furthest ≥ last index, return true",
    ],
    approach: "Greedy forward scan maintaining maxReach.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Greedy",
  },
  {
    id: 14,
    title: "House Robber — max sum of non-adjacent elements",
    tag: "Dynamic Programming",
    difficulty: "Medium",
    summary: "Find the maximum sum from a sequence where no two adjacent elements can be chosen.",
    keyPoints: [
      "dp[i] = max(dp[i-1], dp[i-2] + nums[i])",
      "Only need to track prev2 and prev1 (O(1) space)",
      "House Robber II: handle circular array by running twice (exclude first or last)",
    ],
    approach: "1D DP reduced to two variables.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "DP",
  },
  {
    id: 15,
    title: "Longest common subsequence (LCS)",
    tag: "Dynamic Programming",
    difficulty: "Medium",
    summary: "Find the length of the longest subsequence common to two strings.",
    keyPoints: [
      "dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]",
      "Match: dp[i][j] = dp[i-1][j-1] + 1; else max(dp[i-1][j], dp[i][j-1])",
      "Space-optimized to O(min(m,n)) with a single row",
    ],
    approach: "2D DP table, space-optimizable to 1D.",
    timeComplexity: "O(m×n)",
    spaceComplexity: "O(min(m,n))",
    pattern: "DP / 2D Table",
  },
  {
    id: 16,
    title: "Edit distance (Levenshtein)",
    tag: "Dynamic Programming",
    difficulty: "Medium",
    summary: "Minimum insert/delete/replace operations to convert word1 to word2.",
    keyPoints: [
      "dp[i][j] = edit distance between word1[0..i-1] and word2[0..j-1]",
      "If chars match: dp[i][j] = dp[i-1][j-1]",
      "Else: 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])",
    ],
    approach: "2D DP. Base cases: dp[i][0]=i, dp[0][j]=j.",
    timeComplexity: "O(m×n)",
    spaceComplexity: "O(min(m,n))",
    pattern: "DP / 2D Table",
  },
  {
    id: 17,
    title: "Partition equal subset sum",
    tag: "Dynamic Programming",
    difficulty: "Medium",
    summary: "Determine if an array can be partitioned into two subsets with equal sum.",
    keyPoints: [
      "Total sum must be even; target = sum/2",
      "0/1 knapsack DP: dp[j] = can we achieve sum j?",
      "Traverse nums outer, sums inner in reverse",
    ],
    approach: "0/1 knapsack with boolean DP array.",
    timeComplexity: "O(n × sum/2)",
    spaceComplexity: "O(sum/2)",
    pattern: "0/1 Knapsack",
  },
  {
    id: 18,
    title: "Climbing stairs with variable steps",
    tag: "Dynamic Programming",
    difficulty: "Medium",
    summary: "Count ways to climb n stairs taking 1 or 2 steps at a time.",
    keyPoints: [
      "dp[i] = dp[i-1] + dp[i-2] — Fibonacci pattern",
      "Can generalize to k-step variants",
      "Space-optimized to O(1) with two variables",
    ],
    approach: "Fibonacci DP.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "DP / Fibonacci",
  },
  {
    id: 19,
    title: "Best time to buy and sell stock with cooldown",
    tag: "Dynamic Programming",
    difficulty: "Medium",
    summary: "Maximize profit with a 1-day cooldown after selling.",
    keyPoints: [
      "States: held (holding stock), sold (just sold), rest (cooldown over)",
      "Transitions: held = max(held, rest - price); sold = held + price; rest = max(rest, sold)",
      "Answer is max(sold, rest) after all prices",
    ],
    approach: "State-machine DP with three states.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "State Machine DP",
  },
  {
    id: 20,
    title: "Matrix chain multiplication (minimum cost)",
    tag: "Dynamic Programming",
    difficulty: "Medium",
    summary: "Find the optimal parenthesization of matrix multiplications to minimize scalar multiplications.",
    keyPoints: [
      "dp[i][j] = min cost to multiply matrices i through j",
      "Try all splits k: dp[i][j] = min(dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j])",
      "Fill by increasing chain length",
    ],
    approach: "Interval DP: fill table by subproblem length.",
    timeComplexity: "O(n³)",
    spaceComplexity: "O(n²)",
    pattern: "Interval DP",
  },
  // Greedy
  {
    id: 21,
    title: "Non-overlapping intervals — minimum removal",
    tag: "Greedy",
    difficulty: "Medium",
    summary: "Find the minimum number of intervals to remove so no two overlap.",
    keyPoints: [
      "Sort by end time (greedy: keep interval with earliest end)",
      "Greedily select intervals that don't overlap with the last selected",
      "Count removed = total - kept",
    ],
    approach: "Sort by end time + greedy selection.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    pattern: "Greedy / Interval Scheduling",
  },
  {
    id: 22,
    title: "Gas station — can you complete the circuit?",
    tag: "Greedy",
    difficulty: "Medium",
    summary: "Find the starting station for a circular route if possible.",
    keyPoints: [
      "If total gas < total cost, no solution",
      "Track current tank; if it goes negative, reset and try next station as start",
      "The last candidate start after full scan is the answer",
    ],
    approach: "Single-pass greedy: reset starting point when tank runs out.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Greedy",
  },
  {
    id: 23,
    title: "Meeting rooms II — minimum rooms needed",
    tag: "Greedy / Heap",
    difficulty: "Medium",
    summary: "Find the minimum number of conference rooms to hold all meetings.",
    keyPoints: [
      "Sort meetings by start time",
      "Min-heap of end times: if next start >= min end, reuse room (pop and push new end)",
      "Otherwise allocate a new room (push new end); heap size = rooms used",
    ],
    approach: "Sort + min-heap of room end times.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    pattern: "Greedy + Heap",
  },
  {
    id: 24,
    title: "Candy distribution — minimum candies",
    tag: "Greedy",
    difficulty: "Medium",
    summary: "Assign minimum candies to children so higher-rated neighbors get more.",
    keyPoints: [
      "Two-pass greedy: left-to-right and right-to-left",
      "Left pass: if rating[i] > rating[i-1], candies[i] = candies[i-1]+1",
      "Right pass: if rating[i] > rating[i+1], candies[i] = max(candies[i], candies[i+1]+1)",
    ],
    approach: "Two-pass greedy ensuring both neighbor constraints.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    pattern: "Greedy",
  },
  // Two Pointers & Sliding Window
  {
    id: 25,
    title: "Longest subarray with sum ≤ k (all positives)",
    tag: "Sliding Window",
    difficulty: "Medium",
    summary: "Find the maximum length subarray with sum at most k.",
    keyPoints: [
      "Expand right pointer; when sum > k, shrink from left",
      "For mixed-sign arrays, use prefix sums + sorted structure",
      "Positive-only: two-pointer sliding window is O(n)",
    ],
    approach: "Two-pointer sliding window for positive arrays.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Sliding Window",
  },
  {
    id: 26,
    title: "Four Sum — find all unique quadruplets summing to target",
    tag: "Two Pointers",
    difficulty: "Medium",
    summary: "Generalize 3Sum to four elements.",
    keyPoints: [
      "Sort the array",
      "Fix two outer loops (O(n²)) and use two-pointer for the inner pair",
      "Skip duplicates at every pointer level",
    ],
    approach: "Sort + O(n²) outer loops + two-pointer O(n) inner.",
    timeComplexity: "O(n³)",
    spaceComplexity: "O(1) extra",
    pattern: "Two Pointers",
  },
  {
    id: 27,
    title: "Trapping rain water",
    tag: "Two Pointers",
    difficulty: "Medium",
    summary: "Compute total water trapped between elevation bars.",
    keyPoints: [
      "Water at i = min(maxLeft[i], maxRight[i]) - height[i]",
      "Two-pointer O(1) space: advance the smaller-max side inward",
      "leftMax and rightMax track running maximums from each side",
    ],
    approach: "Two-pointer: always advance the smaller boundary side.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    pattern: "Two Pointers",
  },
  {
    id: 28,
    title: "Permutation in string (sliding window)",
    tag: "Sliding Window",
    difficulty: "Medium",
    summary: "Check if any permutation of pattern p exists as a substring of string s.",
    keyPoints: [
      "Fixed-size window of len(p) over s",
      "Compare character frequency maps",
      "Use a 'diff' counter to avoid full-array comparison each slide",
    ],
    approach: "Fixed sliding window with frequency diff tracking.",
    timeComplexity: "O(|s|)",
    spaceComplexity: "O(1) (26 chars)",
    pattern: "Fixed Sliding Window",
  },
  // Backtracking
  {
    id: 29,
    title: "Subsets — generate all subsets (power set)",
    tag: "Backtracking",
    difficulty: "Medium",
    summary: "Generate all 2^n subsets of a given set.",
    keyPoints: [
      "Backtracking: at each index include or exclude the element",
      "Iterative bit-mask: for each number 0 to 2^n-1, collect set bits",
      "For duplicates: sort and skip equal adjacent elements after first use",
    ],
    approach: "DFS backtracking with a running subset that's saved at each node.",
    timeComplexity: "O(n × 2^n)",
    spaceComplexity: "O(n) recursion",
    pattern: "Backtracking",
  },
  {
    id: 30,
    title: "Combination sum — unique combinations summing to target",
    tag: "Backtracking",
    difficulty: "Medium",
    summary: "Find all combinations of numbers that sum to target (numbers can repeat).",
    keyPoints: [
      "Backtrack with a start index; allow reuse by not incrementing start on recursion",
      "Prune when current sum exceeds target",
      "Sort candidates for more effective pruning",
    ],
    approach: "DFS backtracking with remaining sum, allowing element reuse.",
    timeComplexity: "O(2^(target/min))",
    spaceComplexity: "O(target/min) depth",
    pattern: "Backtracking",
  },
  {
    id: 31,
    title: "Permutations of a list (with duplicates)",
    tag: "Backtracking",
    difficulty: "Medium",
    summary: "Generate all unique permutations of a list that may contain duplicates.",
    keyPoints: [
      "Sort, then use backtracking with a used[] boolean array",
      "Skip if nums[i] == nums[i-1] and !used[i-1] (avoid duplicate branches)",
      "Swap-based approach (without sorting) for no duplicates",
    ],
    approach: "Backtracking with sort + duplicate-skip condition.",
    timeComplexity: "O(n! × n)",
    spaceComplexity: "O(n)",
    pattern: "Backtracking",
  },
  {
    id: 32,
    title: "Letter combinations of a phone number",
    tag: "Backtracking",
    difficulty: "Medium",
    summary: "Return all possible letter combinations a phone-pad digit string can represent.",
    keyPoints: [
      "Map each digit to its letters (T9 mapping)",
      "Backtrack through each digit, appending one letter at a time",
      "Base case: current string length == digits length",
    ],
    approach: "DFS backtracking with a digit-to-letters map.",
    timeComplexity: "O(4^n × n) — n = digits length",
    spaceComplexity: "O(n) recursion stack",
    pattern: "Backtracking",
  },
  {
    id: 33,
    title: "N-Queens — place N queens on N×N board without conflict",
    tag: "Backtracking",
    difficulty: "Medium",
    summary: "Find all valid N-Queens placements.",
    keyPoints: [
      "Place one queen per row; track used columns and both diagonals",
      "Diagonals: col-row is unique for '/' diagonal, col+row for '\\'",
      "Use sets to check conflicts in O(1)",
    ],
    approach: "Row-by-row backtracking with column and diagonal conflict sets.",
    timeComplexity: "O(n!)",
    spaceComplexity: "O(n)",
    pattern: "Backtracking",
  },
  {
    id: 34,
    title: "Palindrome partitioning",
    tag: "Backtracking / DP",
    difficulty: "Medium",
    summary: "Partition a string such that every substring is a palindrome; return all partitions.",
    keyPoints: [
      "Backtrack: at each start index try all end indices",
      "If s[start..end] is a palindrome, recurse from end+1",
      "Pre-compute palindrome check with DP for O(1) substring check",
    ],
    approach: "Backtracking + palindrome DP table.",
    timeComplexity: "O(n × 2^n)",
    spaceComplexity: "O(n²) DP table",
    pattern: "Backtracking + DP",
  },
  // Graph Algorithms
  {
    id: 35,
    title: "Dijkstra's shortest path algorithm",
    tag: "Graph / Shortest Path",
    difficulty: "Medium",
    summary: "Find the shortest path from a source to all nodes in a weighted graph with non-negative edges.",
    keyPoints: [
      "Priority queue (min-heap) ordered by distance",
      "Relax neighbors: if dist[u] + w < dist[v], update dist[v]",
      "Works only for non-negative weights",
    ],
    approach: "Min-heap Dijkstra: process each node when it's popped from the heap.",
    timeComplexity: "O((V+E) log V)",
    spaceComplexity: "O(V)",
    pattern: "Greedy + Min-Heap",
  },
  {
    id: 36,
    title: "Topological sort of a DAG (Kahn's algorithm)",
    tag: "Graph / Topological Sort",
    difficulty: "Medium",
    summary: "Order nodes of a directed acyclic graph so all edges go from earlier to later.",
    keyPoints: [
      "Compute in-degrees; enqueue all zero-in-degree nodes",
      "Process queue: decrement neighbors' in-degrees, enqueue those reaching 0",
      "If result length < V, a cycle exists",
    ],
    approach: "BFS (Kahn's): process in-degree 0 nodes iteratively.",
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V+E)",
    pattern: "BFS / Topological Sort",
  },
  {
    id: 37,
    title: "Bellman-Ford — detect negative weight cycles",
    tag: "Graph / Shortest Path",
    difficulty: "Medium",
    summary: "Find shortest paths and detect negative cycles in a weighted directed graph.",
    keyPoints: [
      "Relax all edges V-1 times (guarantees shortest paths if no negative cycle)",
      "A V-th relaxation that still reduces a distance means a negative cycle exists",
      "Handles negative edges unlike Dijkstra",
    ],
    approach: "V-1 edge relaxation passes.",
    timeComplexity: "O(V×E)",
    spaceComplexity: "O(V)",
    pattern: "Dynamic Programming / Edge Relaxation",
  },
  {
    id: 38,
    title: "Union-Find — connected components with dynamic union",
    tag: "Union-Find",
    difficulty: "Medium",
    summary: "Efficiently manage and query connected components with union-by-rank and path compression.",
    keyPoints: [
      "find() with path compression: O(α(n)) amortized",
      "union() by rank prevents tall trees",
      "Use for dynamic connectivity, minimum spanning tree (Kruskal's)",
    ],
    approach: "Disjoint Set Union with path compression + union by rank.",
    timeComplexity: "O(α(n)) per op",
    spaceComplexity: "O(n)",
    pattern: "Union-Find",
  },
  {
    id: 39,
    title: "Flood fill algorithm",
    tag: "Graph / DFS",
    difficulty: "Medium",
    summary: "Recolor a connected region in a 2D grid starting from a given pixel.",
    keyPoints: [
      "DFS/BFS from the starting cell",
      "Only spread to cells with the same original color",
      "Guard against infinite recursion if newColor == oldColor",
    ],
    approach: "DFS flood fill with color-match condition.",
    timeComplexity: "O(m×n)",
    spaceComplexity: "O(m×n) recursion",
    pattern: "DFS / BFS",
  },
  {
    id: 40,
    title: "Pacific Atlantic water flow",
    tag: "Graph / DFS",
    difficulty: "Medium",
    summary: "Find cells from which water can flow to both Pacific and Atlantic oceans.",
    keyPoints: [
      "Reverse-flow BFS/DFS from ocean boundaries inward",
      "Pacific: top row + left col; Atlantic: bottom row + right col",
      "Cells reachable from both = answer",
    ],
    approach: "Two BFS/DFS passes from each ocean boundary; intersect reachable sets.",
    timeComplexity: "O(m×n)",
    spaceComplexity: "O(m×n)",
    pattern: "Multi-Source DFS / BFS",
  },
  // Recursion & Divide and Conquer
  {
    id: 41,
    title: "Merge sort — divide and conquer sort",
    tag: "Divide & Conquer",
    difficulty: "Medium",
    summary: "Sort an array using the merge-sort divide-and-conquer technique.",
    keyPoints: [
      "Divide array in half recursively until size 1",
      "Merge two sorted halves in linear time",
      "Stable sort; O(n log n) guaranteed",
    ],
    approach: "Recursive halving + linear merge.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    pattern: "Divide & Conquer",
  },
  {
    id: 42,
    title: "QuickSelect — find Kth smallest element in O(n) average",
    tag: "Divide & Conquer",
    difficulty: "Medium",
    summary: "Find the kth smallest element without fully sorting the array.",
    keyPoints: [
      "Partition around a pivot (Lomuto or Hoare scheme)",
      "If pivot index == k, return; else recurse into the correct half",
      "Randomized pivot makes average O(n), worst O(n²)",
    ],
    approach: "Randomized QuickSelect partition.",
    timeComplexity: "O(n) average, O(n²) worst",
    spaceComplexity: "O(log n) average",
    pattern: "Divide & Conquer",
  },
  {
    id: 43,
    title: "Pow(x, n) — fast exponentiation",
    tag: "Divide & Conquer / Math",
    difficulty: "Medium",
    summary: "Compute x^n efficiently using binary exponentiation.",
    keyPoints: [
      "If n is even: x^n = (x²)^(n/2)",
      "If n is odd: x^n = x × x^(n-1)",
      "Handle negative n: x^(-n) = 1/x^n",
    ],
    approach: "Binary exponentiation (exponentiation by squaring).",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(log n) recursion / O(1) iterative",
    pattern: "Divide & Conquer",
  },
  {
    id: 44,
    title: "Count inversions in array",
    tag: "Divide & Conquer",
    difficulty: "Medium",
    summary: "Count pairs (i, j) where i < j but arr[i] > arr[j] using modified merge sort.",
    keyPoints: [
      "During the merge step, when a right-half element is placed before left-half elements, all remaining left-half elements form inversions",
      "Count = mid - left_pointer for each such placement",
      "Piggybacks on merge sort for O(n log n)",
    ],
    approach: "Modified merge sort: count inversions during merge phase.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    pattern: "Merge Sort / Divide & Conquer",
  },
  {
    id: 45,
    title: "Generate parentheses — all valid combinations of n pairs",
    tag: "Backtracking / Recursion",
    difficulty: "Medium",
    summary: "Generate all strings of n pairs of well-formed parentheses.",
    keyPoints: [
      "Track open and close counts; open < n → can add '('; close < open → can add ')'",
      "Base case: string length == 2n",
      "Produces exactly Catalan(n) strings",
    ],
    approach: "Backtracking with open/close counters as constraints.",
    timeComplexity: "O(4^n / √n) — Catalan number",
    spaceComplexity: "O(n) recursion",
    pattern: "Backtracking",
  },
];

// ─────────────────────────────────────────────
// Tag color mapping
// ─────────────────────────────────────────────
const tagColors: Record<string, string> = {
  "Array": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Array / Matrix": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Array / HashMap": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Array / HashSet": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Linked List": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Stack": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Queue / Deque": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Tree": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Trie": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Trie / Backtracking": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Heap": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Heap / Greedy": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Graph / DFS": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Graph / BFS": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Graph / Topological Sort": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "HashMap": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "HashMap / Heap": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "HashMap / Sliding Window": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "HashMap / Doubly Linked List": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "String": "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  "String / Sliding Window": "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  "Bit Manipulation": "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  "Binary Search": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Binary Search on Answer": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Sorting": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Dynamic Programming": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Dynamic Programming / Greedy": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Greedy": "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
  "Greedy / Heap": "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
  "Two Pointers": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "Sliding Window": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "Backtracking": "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
  "Backtracking / DP": "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
  "Backtracking / Recursion": "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
  "Graph / Shortest Path": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Union-Find": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Divide & Conquer": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Divide & Conquer / Math": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function getTagColor(tag: string): string {
  return tagColors[tag] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
}

// ─────────────────────────────────────────────
// Question Card Component
// ─────────────────────────────────────────────
function QuestionCard({
  q,
  index,
  expanded,
  onToggle,
}: {
  q: DSAQuestion;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border rounded-sm transition-all duration-200 ${
        expanded
          ? "border-zinc-400 dark:border-zinc-600 shadow-md"
          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
      } bg-white dark:bg-[#18181b]`}
    >
      {/* Header Row */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-3 group"
        aria-expanded={expanded}
      >
        {/* Index badge */}
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-mono font-bold flex items-center justify-center mt-0.5">
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${getTagColor(
                q.tag
              )}`}
            >
              {q.tag}
            </span>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              {q.difficulty}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 ml-1">
              {q.pattern}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug pr-4">
            {q.title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 group-hover:line-clamp-none transition-all">
            {q.summary}
          </p>
        </div>

        <span className="flex-shrink-0 text-zinc-400 dark:text-zinc-500 mt-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
          {/* Key Points */}
          <div>
            <p className="text-[10px] font-black font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
              Key Points
            </p>
            <ul className="space-y-1.5">
              {q.keyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Approach */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm p-3">
            <p className="text-[10px] font-black font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">
              Approach
            </p>
            <p className="text-xs text-zinc-700 dark:text-zinc-300">{q.approach}</p>
          </div>

          {/* Complexity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-sm p-2.5">
              <p className="text-[9px] font-black font-mono uppercase tracking-wider text-blue-400 mb-0.5">
                Time
              </p>
              <p className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
                {q.timeComplexity}
              </p>
            </div>
            <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-sm p-2.5">
              <p className="text-[9px] font-black font-mono uppercase tracking-wider text-violet-400 mb-0.5">
                Space
              </p>
              <p className="text-xs font-mono font-bold text-violet-700 dark:text-violet-300">
                {q.spaceComplexity}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to check if a question matches a Data Structure filter
function matchesDsFilter(q: DSAQuestion, filter: string): boolean {
  if (filter === "all") return true;
  const tagLower = q.tag.toLowerCase();
  const patternLower = q.pattern.toLowerCase();
  const titleLower = q.title.toLowerCase();
  const searchSpace = `${tagLower} ${patternLower} ${titleLower}`;

  switch (filter) {
    case "array":
      return searchSpace.includes("array") || searchSpace.includes("matrix");
    case "list":
      return searchSpace.includes("linked list") || searchSpace.includes("list");
    case "stack-queue":
      return searchSpace.includes("stack") || searchSpace.includes("queue") || searchSpace.includes("deque");
    case "tree":
      return searchSpace.includes("tree") || searchSpace.includes("trie");
    case "heap":
      return searchSpace.includes("heap");
    case "graph":
      return searchSpace.includes("graph") || searchSpace.includes("union-find") || searchSpace.includes("island") || searchSpace.includes("topological");
    case "hash":
      return searchSpace.includes("hashmap") || searchSpace.includes("hashset") || searchSpace.includes("hash");
    case "string":
      return searchSpace.includes("string") || searchSpace.includes("substring") || searchSpace.includes("anagram");
    case "bit":
      return searchSpace.includes("bit") || searchSpace.includes("binary") || searchSpace.includes("hamming");
    default:
      return false;
  }
}

// Helper to check if a question matches an Algorithm filter
function matchesAlgoFilter(q: DSAQuestion, filter: string): boolean {
  if (filter === "all") return true;
  const tagLower = q.tag.toLowerCase();
  const patternLower = q.pattern.toLowerCase();
  const titleLower = q.title.toLowerCase();
  const approachLower = q.approach.toLowerCase();
  const searchSpace = `${tagLower} ${patternLower} ${titleLower} ${approachLower}`;

  switch (filter) {
    case "binary-search":
      return searchSpace.includes("binary search");
    case "sorting":
      return searchSpace.includes("sorting") || searchSpace.includes("sort");
    case "dp":
      return searchSpace.includes("dynamic programming") || searchSpace.includes("dp") || searchSpace.includes("kadane");
    case "greedy":
      return searchSpace.includes("greedy");
    case "two-pointers":
      return searchSpace.includes("two pointer") || searchSpace.includes("two-pointer") || searchSpace.includes("sliding window") || searchSpace.includes("deque");
    case "backtracking":
      return searchSpace.includes("backtracking") || searchSpace.includes("recursion") || searchSpace.includes("dfs") || searchSpace.includes("bfs") || searchSpace.includes("topological");
    case "divide-conquer":
      return searchSpace.includes("divide") || searchSpace.includes("conquer") || searchSpace.includes("merge sort") || searchSpace.includes("quickselect");
    default:
      return false;
  }
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function DsaPage() {
  const [activeTab, setActiveTab] = useState<Tab>("ds");
  const [searchQuery, setSearchQuery] = useState("");
  const [dsFilter, setDsFilter] = useState("all");
  const [algoFilter, setAlgoFilter] = useState("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const questions = activeTab === "ds" ? dsQuestions : algoQuestions;

  const filtered = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.pattern.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    const matchesDs = matchesDsFilter(q, dsFilter);
    const matchesAlgo = matchesAlgoFilter(q, algoFilter);

    return matchesDs && matchesAlgo;
  });

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setExpandedIndex(null);
    setSearchQuery("");
    setDsFilter("all");
    setAlgoFilter("all");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-zinc-400" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">DSA Practice</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50 mb-2">
          Top DSA Interview Questions
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
          45 medium-level Data Structures questions + 45 Algorithm questions — curated for FAANG and top-tier engineering interviews.
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-4 mt-4">
          {[
            { label: "Data Structure Qs", value: "45", color: "text-blue-600 dark:text-blue-400" },
            { label: "Algorithm Qs", value: "45", color: "text-purple-600 dark:text-purple-400" },
            { label: "Difficulty", value: "Medium", color: "text-amber-600 dark:text-amber-400" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={`text-xl font-black font-mono ${s.color}`}>{s.value}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6">
        <button
          onClick={() => handleTabChange("ds")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === "ds"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
              : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          Data Structures
          <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-sm">
            45
          </span>
        </button>
        <button
          onClick={() => handleTabChange("algo")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === "algo"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
              : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          <GitBranch className="w-4 h-4" />
          Algorithms
          <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-sm">
            45
          </span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search by title, tag, or pattern..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setExpandedIndex(null);
          }}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 rounded-sm transition-colors"
        />
      </div>

      {/* Filter Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* DS Filter */}
        <div className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5 font-mono">
            Filter by Data Structure
          </label>
          <div className="relative">
            <select
              value={dsFilter}
              onChange={(e) => {
                setDsFilter(e.target.value);
                setExpandedIndex(null);
              }}
              className="w-full pl-3 pr-10 py-2.5 text-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 rounded-sm appearance-none cursor-pointer"
            >
              <option value="all">All Data Structures</option>
              <option value="array">Arrays & Matrices</option>
              <option value="list">Linked Lists</option>
              <option value="stack-queue">Stacks & Queues</option>
              <option value="tree">Trees & Tries</option>
              <option value="heap">Heaps (Priority Queues)</option>
              <option value="graph">Graphs & Union-Find</option>
              <option value="hash">HashMaps & HashSets</option>
              <option value="string">Strings & Substrings</option>
              <option value="bit">Bit Manipulation</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Algo Filter */}
        <div className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5 font-mono">
            Filter by Algorithm
          </label>
          <div className="relative">
            <select
              value={algoFilter}
              onChange={(e) => {
                setAlgoFilter(e.target.value);
                setExpandedIndex(null);
              }}
              className="w-full pl-3 pr-10 py-2.5 text-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 rounded-sm appearance-none cursor-pointer"
            >
              <option value="all">All Algorithms</option>
              <option value="binary-search">Binary Search</option>
              <option value="sorting">Sorting Algorithms</option>
              <option value="dp">Dynamic Programming & Kadane's</option>
              <option value="greedy">Greedy Algorithms</option>
              <option value="two-pointers">Two Pointers & Sliding Window</option>
              <option value="backtracking">Backtracking, DFS & BFS</option>
              <option value="divide-conquer">Divide & Conquer</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Section subtitle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {activeTab === "ds" ? (
            <Layers className="w-4 h-4 text-zinc-400" />
          ) : (
            <Cpu className="w-4 h-4 text-zinc-400" />
          )}
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            {activeTab === "ds" ? "Data Structures" : "Algorithms"}
          </span>
        </div>
        <span className="text-xs text-zinc-400 font-mono">
          {filtered.length} question{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Notice banner */}
      <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-sm p-3 mb-6">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          All questions are medium-difficulty. Click any question to expand the approach, key points, and time/space complexities.
        </p>
      </div>

      {/* Question List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No questions match your search or active filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setDsFilter("all");
              setAlgoFilter("all");
            }}
            className="mt-2 text-xs underline text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((q, idx) => (
            <QuestionCard
              key={`${activeTab}-${q.id}`}
              q={q}
              index={idx}
              expanded={expandedIndex === idx}
              onToggle={() => toggleExpand(idx)}
            />
          ))}
        </div>
      )}

      {/* Footer note */}
      <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-zinc-400" />
          <p className="text-xs text-zinc-400 font-mono">
            Patterns covered: Arrays · Linked Lists · Trees · Graphs · DP · Greedy · Backtracking · Divide &amp; Conquer · Bit Manipulation
          </p>
        </div>
      </div>
    </div>
  );
}
