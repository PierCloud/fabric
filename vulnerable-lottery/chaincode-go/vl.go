package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	pb "github.com/hyperledger/fabric-protos-go/peer"
	"github.com/hyperledger/fabric/core/ledger"
	//"github.com/hyperledger/fabric/protoutil"
	"log"
	"math/rand"
	"strconv"
)

type SmartContract struct {
	contractapi.Contract
}

type Ticket struct {
	Owner string `json:"owner"`
	Guess string `json:"guess"`
	Won   bool   `json:"won"`
}

type Win struct {
	ID     string `json:"id"`
	Number string `json:"number"`
	Won    bool   `json:"won"`
}

func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	err := s.generateNewWin(ctx)
	if err != nil {
		return err
	}

	return nil
}

func (s *SmartContract) GuessNumber(ctx contractapi.TransactionContextInterface, guess string) error {
	currentWin, err := s.GetCurrentWin(ctx)
	if err != nil {
		return err
	}

	var ticket Ticket
	owner, _ := ctx.GetClientIdentity().GetID()

	if currentWin.Number == guess {
		ticket = Ticket{
			Owner: owner,
			Guess: guess,
			Won:   true,
		}

		err = s.generateNewWin(ctx)
		if err != nil {
			return err
		}
	} else {
		ticket = Ticket{
			Owner: owner,
			Guess: guess,
			Won:   false,
		}
	}

	assetJSON, err := json.Marshal(ticket)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(ticket.Owner, assetJSON)
}

func (s *SmartContract) generateNewWin(ctx contractapi.TransactionContextInterface) error {
	// Generate random number
	timestamp, err := ctx.GetStub().GetTxTimestamp()
	if err != nil {
		return err
	}
	rand.Seed(timestamp.GetSeconds())
	randomNumber := rand.Int()

	h := sha256.New()
	h.Write([]byte(strconv.Itoa(randomNumber)))
	hashedNumber := hex.EncodeToString(h.Sum(nil))

	// Create new winning number
	asset := Win{
		ID:     "current_win",
		Number: hashedNumber,
		Won:    false,
	}

	assetBytes, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	// Store the winning number
	err = ctx.GetStub().PutState(asset.ID, assetBytes)
	if err != nil {
		return err
	}

	return nil
}

// GetCurrentWin function is public for demo purposes
func (s *SmartContract) GetCurrentWin(ctx contractapi.TransactionContextInterface) (*Win, error) {
	id := "current_win"
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the asset %s does not exist", id)
	}

	var asset Win
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return nil, err
	}

	return &asset, nil
}

// GetRandom Test function
func (s *SmartContract) GetRandom() string {
	return strconv.Itoa(rand.Int())
}

// GetRandomTime Test function
func (s *SmartContract) GetRandomTime(ctx contractapi.TransactionContextInterface) string {
	timestamp, _ := ctx.GetStub().GetTxTimestamp()
	rand.Seed(timestamp.GetSeconds())
	return strconv.Itoa(rand.Int())
}

func (s *SmartContract) getTransactionByID(vledger ledger.PeerLedger, tid []byte) pb.Response {
	if tid == nil {
		return shim.Error("Transaction ID must not be nil.")
	}

	processedTran, err := vledger.GetTransactionByID(string(tid))
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to get transaction with id %s, error %s", string(tid), err))
	}

	bytes, err := json.Marshal(processedTran)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(bytes)
}

func main() {
	chaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		log.Panicf("Error creating asset chaincode: %v", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panicf("Error starting asset chaincode: %v", err)
	}
}
