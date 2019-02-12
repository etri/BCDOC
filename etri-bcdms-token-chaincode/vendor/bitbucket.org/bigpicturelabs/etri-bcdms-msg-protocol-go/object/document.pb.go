// Code generated by protoc-gen-go. DO NOT EDIT.
// source: object/document.proto

package object

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion2 // please upgrade the proto package

type Document struct {
	Id                   string               `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Type                 string               `protobuf:"bytes,2,opt,name=type,proto3" json:"type,omitempty"`
	VersionList          []*VersionedDocument `protobuf:"bytes,3,rep,name=versionList,proto3" json:"versionList,omitempty"`
	XXX_NoUnkeyedLiteral struct{}             `json:"-"`
	XXX_unrecognized     []byte               `json:"-"`
	XXX_sizecache        int32                `json:"-"`
}

func (m *Document) Reset()         { *m = Document{} }
func (m *Document) String() string { return proto.CompactTextString(m) }
func (*Document) ProtoMessage()    {}
func (*Document) Descriptor() ([]byte, []int) {
	return fileDescriptor_262b0f04eadfb8d9, []int{0}
}

func (m *Document) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Document.Unmarshal(m, b)
}
func (m *Document) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Document.Marshal(b, m, deterministic)
}
func (m *Document) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Document.Merge(m, src)
}
func (m *Document) XXX_Size() int {
	return xxx_messageInfo_Document.Size(m)
}
func (m *Document) XXX_DiscardUnknown() {
	xxx_messageInfo_Document.DiscardUnknown(m)
}

var xxx_messageInfo_Document proto.InternalMessageInfo

func (m *Document) GetId() string {
	if m != nil {
		return m.Id
	}
	return ""
}

func (m *Document) GetType() string {
	if m != nil {
		return m.Type
	}
	return ""
}

func (m *Document) GetVersionList() []*VersionedDocument {
	if m != nil {
		return m.VersionList
	}
	return nil
}

type VersionedDocument struct {
	Title                string            `protobuf:"bytes,1,opt,name=title,proto3" json:"title,omitempty"`
	AuthorList           []*Author         `protobuf:"bytes,2,rep,name=authorList,proto3" json:"authorList,omitempty"`
	ProjectID            string            `protobuf:"bytes,3,opt,name=projectID,proto3" json:"projectID,omitempty"`
	Envelope             *DocumentEnvelope `protobuf:"bytes,4,opt,name=envelope,proto3" json:"envelope,omitempty"`
	HashValue            string            `protobuf:"bytes,5,opt,name=hashValue,proto3" json:"hashValue,omitempty"`
	EvaluationList       []*Evaluation     `protobuf:"bytes,6,rep,name=evaluationList,proto3" json:"evaluationList,omitempty"`
	Score                int32             `protobuf:"varint,7,opt,name=score,proto3" json:"score,omitempty"`
	XXX_NoUnkeyedLiteral struct{}          `json:"-"`
	XXX_unrecognized     []byte            `json:"-"`
	XXX_sizecache        int32             `json:"-"`
}

func (m *VersionedDocument) Reset()         { *m = VersionedDocument{} }
func (m *VersionedDocument) String() string { return proto.CompactTextString(m) }
func (*VersionedDocument) ProtoMessage()    {}
func (*VersionedDocument) Descriptor() ([]byte, []int) {
	return fileDescriptor_262b0f04eadfb8d9, []int{1}
}

func (m *VersionedDocument) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_VersionedDocument.Unmarshal(m, b)
}
func (m *VersionedDocument) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_VersionedDocument.Marshal(b, m, deterministic)
}
func (m *VersionedDocument) XXX_Merge(src proto.Message) {
	xxx_messageInfo_VersionedDocument.Merge(m, src)
}
func (m *VersionedDocument) XXX_Size() int {
	return xxx_messageInfo_VersionedDocument.Size(m)
}
func (m *VersionedDocument) XXX_DiscardUnknown() {
	xxx_messageInfo_VersionedDocument.DiscardUnknown(m)
}

var xxx_messageInfo_VersionedDocument proto.InternalMessageInfo

func (m *VersionedDocument) GetTitle() string {
	if m != nil {
		return m.Title
	}
	return ""
}

func (m *VersionedDocument) GetAuthorList() []*Author {
	if m != nil {
		return m.AuthorList
	}
	return nil
}

func (m *VersionedDocument) GetProjectID() string {
	if m != nil {
		return m.ProjectID
	}
	return ""
}

func (m *VersionedDocument) GetEnvelope() *DocumentEnvelope {
	if m != nil {
		return m.Envelope
	}
	return nil
}

func (m *VersionedDocument) GetHashValue() string {
	if m != nil {
		return m.HashValue
	}
	return ""
}

func (m *VersionedDocument) GetEvaluationList() []*Evaluation {
	if m != nil {
		return m.EvaluationList
	}
	return nil
}

func (m *VersionedDocument) GetScore() int32 {
	if m != nil {
		return m.Score
	}
	return 0
}

type Author struct {
	Id                   string   `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Name                 string   `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Author) Reset()         { *m = Author{} }
func (m *Author) String() string { return proto.CompactTextString(m) }
func (*Author) ProtoMessage()    {}
func (*Author) Descriptor() ([]byte, []int) {
	return fileDescriptor_262b0f04eadfb8d9, []int{2}
}

func (m *Author) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Author.Unmarshal(m, b)
}
func (m *Author) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Author.Marshal(b, m, deterministic)
}
func (m *Author) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Author.Merge(m, src)
}
func (m *Author) XXX_Size() int {
	return xxx_messageInfo_Author.Size(m)
}
func (m *Author) XXX_DiscardUnknown() {
	xxx_messageInfo_Author.DiscardUnknown(m)
}

var xxx_messageInfo_Author proto.InternalMessageInfo

func (m *Author) GetId() string {
	if m != nil {
		return m.Id
	}
	return ""
}

func (m *Author) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

type DocumentEnvelope struct {
	FileName             string   `protobuf:"bytes,1,opt,name=fileName,proto3" json:"fileName,omitempty"`
	Version              string   `protobuf:"bytes,2,opt,name=version,proto3" json:"version,omitempty"`
	IssueDate            int64    `protobuf:"varint,3,opt,name=issueDate,proto3" json:"issueDate,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *DocumentEnvelope) Reset()         { *m = DocumentEnvelope{} }
func (m *DocumentEnvelope) String() string { return proto.CompactTextString(m) }
func (*DocumentEnvelope) ProtoMessage()    {}
func (*DocumentEnvelope) Descriptor() ([]byte, []int) {
	return fileDescriptor_262b0f04eadfb8d9, []int{3}
}

func (m *DocumentEnvelope) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_DocumentEnvelope.Unmarshal(m, b)
}
func (m *DocumentEnvelope) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_DocumentEnvelope.Marshal(b, m, deterministic)
}
func (m *DocumentEnvelope) XXX_Merge(src proto.Message) {
	xxx_messageInfo_DocumentEnvelope.Merge(m, src)
}
func (m *DocumentEnvelope) XXX_Size() int {
	return xxx_messageInfo_DocumentEnvelope.Size(m)
}
func (m *DocumentEnvelope) XXX_DiscardUnknown() {
	xxx_messageInfo_DocumentEnvelope.DiscardUnknown(m)
}

var xxx_messageInfo_DocumentEnvelope proto.InternalMessageInfo

func (m *DocumentEnvelope) GetFileName() string {
	if m != nil {
		return m.FileName
	}
	return ""
}

func (m *DocumentEnvelope) GetVersion() string {
	if m != nil {
		return m.Version
	}
	return ""
}

func (m *DocumentEnvelope) GetIssueDate() int64 {
	if m != nil {
		return m.IssueDate
	}
	return 0
}

type Evaluation struct {
	Id                   string   `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Score                int32    `protobuf:"varint,2,opt,name=score,proto3" json:"score,omitempty"`
	Comment              string   `protobuf:"bytes,3,opt,name=comment,proto3" json:"comment,omitempty"`
	Date                 int64    `protobuf:"varint,4,opt,name=date,proto3" json:"date,omitempty"`
	DocumentID           string   `protobuf:"bytes,5,opt,name=documentID,proto3" json:"documentID,omitempty"`
	DocumentHashValue    string   `protobuf:"bytes,6,opt,name=documentHashValue,proto3" json:"documentHashValue,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Evaluation) Reset()         { *m = Evaluation{} }
func (m *Evaluation) String() string { return proto.CompactTextString(m) }
func (*Evaluation) ProtoMessage()    {}
func (*Evaluation) Descriptor() ([]byte, []int) {
	return fileDescriptor_262b0f04eadfb8d9, []int{4}
}

func (m *Evaluation) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Evaluation.Unmarshal(m, b)
}
func (m *Evaluation) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Evaluation.Marshal(b, m, deterministic)
}
func (m *Evaluation) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Evaluation.Merge(m, src)
}
func (m *Evaluation) XXX_Size() int {
	return xxx_messageInfo_Evaluation.Size(m)
}
func (m *Evaluation) XXX_DiscardUnknown() {
	xxx_messageInfo_Evaluation.DiscardUnknown(m)
}

var xxx_messageInfo_Evaluation proto.InternalMessageInfo

func (m *Evaluation) GetId() string {
	if m != nil {
		return m.Id
	}
	return ""
}

func (m *Evaluation) GetScore() int32 {
	if m != nil {
		return m.Score
	}
	return 0
}

func (m *Evaluation) GetComment() string {
	if m != nil {
		return m.Comment
	}
	return ""
}

func (m *Evaluation) GetDate() int64 {
	if m != nil {
		return m.Date
	}
	return 0
}

func (m *Evaluation) GetDocumentID() string {
	if m != nil {
		return m.DocumentID
	}
	return ""
}

func (m *Evaluation) GetDocumentHashValue() string {
	if m != nil {
		return m.DocumentHashValue
	}
	return ""
}

func init() {
	proto.RegisterType((*Document)(nil), "object.Document")
	proto.RegisterType((*VersionedDocument)(nil), "object.VersionedDocument")
	proto.RegisterType((*Author)(nil), "object.Author")
	proto.RegisterType((*DocumentEnvelope)(nil), "object.DocumentEnvelope")
	proto.RegisterType((*Evaluation)(nil), "object.Evaluation")
}

func init() { proto.RegisterFile("object/document.proto", fileDescriptor_262b0f04eadfb8d9) }

var fileDescriptor_262b0f04eadfb8d9 = []byte{
	// 433 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x6c, 0x53, 0xc1, 0x8a, 0xdb, 0x30,
	0x10, 0xc5, 0x4e, 0xe2, 0xcd, 0x4e, 0x20, 0x74, 0x45, 0x0b, 0x6a, 0x29, 0x25, 0xf8, 0x94, 0xc3,
	0xc6, 0x81, 0x6d, 0x4f, 0x2d, 0x94, 0xb6, 0x64, 0xa1, 0x0b, 0xa5, 0x07, 0x1f, 0xf6, 0xd0, 0x9b,
	0x2c, 0xcf, 0x26, 0xea, 0xda, 0x96, 0x91, 0xe4, 0x40, 0x3f, 0xa6, 0xbf, 0xd0, 0x6f, 0x2c, 0x92,
	0x2c, 0xc7, 0x6c, 0xf6, 0xa6, 0x99, 0xf7, 0xf2, 0xde, 0xbc, 0x99, 0x18, 0x5e, 0xc9, 0xe2, 0x37,
	0x72, 0xb3, 0x2d, 0x25, 0xef, 0x6a, 0x6c, 0x4c, 0xd6, 0x2a, 0x69, 0x24, 0x49, 0x7c, 0x3b, 0x7d,
	0x84, 0xf9, 0xae, 0x47, 0xc8, 0x12, 0x62, 0x51, 0xd2, 0x68, 0x15, 0xad, 0x2f, 0xf3, 0x58, 0x94,
	0x84, 0xc0, 0xd4, 0xfc, 0x69, 0x91, 0xc6, 0xae, 0xe3, 0xde, 0xe4, 0x13, 0x2c, 0x8e, 0xa8, 0xb4,
	0x90, 0xcd, 0x0f, 0xa1, 0x0d, 0x9d, 0xac, 0x26, 0xeb, 0xc5, 0xcd, 0xeb, 0xcc, 0xab, 0x65, 0xf7,
	0x1e, 0xc2, 0x32, 0x68, 0xe6, 0x63, 0x76, 0xfa, 0x37, 0x86, 0xab, 0x33, 0x0a, 0x79, 0x09, 0x33,
	0x23, 0x4c, 0x85, 0xbd, 0xb3, 0x2f, 0x48, 0x06, 0xc0, 0x3a, 0x73, 0x90, 0xca, 0xf9, 0xc4, 0xce,
	0x67, 0x19, 0x7c, 0xbe, 0x3a, 0x24, 0x1f, 0x31, 0xc8, 0x5b, 0xb8, 0x6c, 0x95, 0xb4, 0xe8, 0xdd,
	0x8e, 0x4e, 0x9c, 0xd2, 0xa9, 0x41, 0x3e, 0xc0, 0x1c, 0x9b, 0x23, 0x56, 0xb2, 0x45, 0x3a, 0x5d,
	0x45, 0xeb, 0xc5, 0x0d, 0x0d, 0x5a, 0x61, 0x8e, 0xdb, 0x1e, 0xcf, 0x07, 0xa6, 0xd5, 0x3c, 0x30,
	0x7d, 0xb8, 0x67, 0x55, 0x87, 0x74, 0xe6, 0x35, 0x87, 0x06, 0xf9, 0x08, 0x4b, 0x3c, 0xb2, 0xaa,
	0x63, 0x26, 0x6c, 0x23, 0x71, 0x53, 0x92, 0xa0, 0x7c, 0x3b, 0xa0, 0xf9, 0x13, 0xa6, 0xcd, 0xac,
	0xb9, 0x54, 0x48, 0x2f, 0x56, 0xd1, 0x7a, 0x96, 0xfb, 0x22, 0xbd, 0x86, 0xc4, 0x27, 0x7b, 0xee,
	0x14, 0x0d, 0xab, 0x87, 0x53, 0xd8, 0x77, 0xfa, 0x00, 0x2f, 0x9e, 0xce, 0x4e, 0xde, 0xc0, 0xfc,
	0x41, 0x54, 0xf8, 0xd3, 0x72, 0xfd, 0xaf, 0x87, 0x9a, 0x50, 0xb8, 0xe8, 0x8f, 0xd1, 0xcb, 0x84,
	0xd2, 0xe6, 0x14, 0x5a, 0x77, 0xb8, 0x63, 0x06, 0xdd, 0xee, 0x26, 0xf9, 0xa9, 0x91, 0xfe, 0x8b,
	0x00, 0x4e, 0x51, 0xce, 0x46, 0x1b, 0xa2, 0xc4, 0xa3, 0x28, 0xd6, 0x8c, 0xcb, 0xda, 0xce, 0xd6,
	0x1f, 0x23, 0x94, 0x36, 0x4a, 0x69, 0x7d, 0xa6, 0xce, 0xc7, 0xbd, 0xc9, 0x3b, 0x80, 0xf0, 0xff,
	0xbc, 0xdb, 0xf5, 0x9b, 0x1e, 0x75, 0xc8, 0x35, 0x5c, 0x85, 0xea, 0xfb, 0x70, 0x90, 0xc4, 0xd1,
	0xce, 0x81, 0x6f, 0x5f, 0x7e, 0x7d, 0x2e, 0x84, 0x29, 0x3a, 0xfe, 0x88, 0x26, 0x93, 0x6a, 0xbf,
	0x2d, 0xc4, 0xbe, 0x15, 0xdc, 0x74, 0x0a, 0x2b, 0x56, 0xe8, 0x2d, 0x1a, 0x25, 0x36, 0x05, 0x2f,
	0x6b, 0xbd, 0xa9, 0xf5, 0x7e, 0xe3, 0x3e, 0x08, 0x2e, 0xab, 0xcd, 0x5e, 0x6e, 0xfd, 0xe5, 0x8a,
	0xc4, 0xf5, 0xde, 0xff, 0x0f, 0x00, 0x00, 0xff, 0xff, 0xb4, 0x82, 0x16, 0x5e, 0x3d, 0x03, 0x00,
	0x00,
}